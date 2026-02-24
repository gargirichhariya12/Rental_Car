import Booking from "../models/Booking.js"
import Car from "../models/Car";

//funtion to check the availability
const checkAvailability  = async (car, pickupDate, returnDate ) =>{
    const bookings = await Booking.find({
        car,
        pickupDate:{$lte, returnDate},
        returnDate :{$gte, pickupDate},
    })
    return bookings.length === 0;
}
//Api to check of cars for the given Date and location
export const checkAvailabilityOfCar = async (res,req) =>{
    try {
        const {location, pickupDate, returnDate} = req.body

        //fetch all available cars for the given location
        const cars = await Car.find({location, isAvailable:true})

        //check car available for the given date range using promise
        const availableCarPromises = cars.map(async (car) =>{
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
            return {...car._doc, isAvailable:isAvailable}
        })

        let availableCars = await Promise.all(availableCarPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success:true, availableCars})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//Api to create Booking
export const createBooking = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return rec.json({success:false, message:'car is not Available'})
        }
        const carData = await Car.findById(car)

        //Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate)
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked )/ (1000 * 60 *60 * 24))
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner : carData.owner, user:_id, pickupDate, returnDate, price})
        res.json({success:true, message:"Booking Created"})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}
//API to list user Booking

export const getUserBooking = async (res, req) =>{
    try {
        const {_id} = req.user;
        const booking = await Booking.find({user:_id}).populate("car").sort({ createdAt : -1})
        res.json({success:true, message:"Booking Created"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


//Api to get Owner Booking
export const getOwnerBooking = async (res, req) =>{
    try {
      if(req.user.role !== 'owner'){
        return res.json({success:false, message:"Unauthorized"})
      }
      const bookings = await Booking.find({owner:req.user._id}).populate('car user') .select("-user.password").sort({createdAt:-1})
      res.json({success : true, bookings})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


//Api to change the booking status

export const changeBookingStatus = async (res, req) =>{
    try {
      const {_id} = req.user;
      const {bookingId, status} = req.body
      const booking = await Booking.findById(bookingId)

      if(booking.owner.toString() !== _id.toString())
        return res.json({success:false, message:"Unauthorized"});

      booking.status = status;
      await booking.save()

      res.json({success:true, message:"status Updated"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}