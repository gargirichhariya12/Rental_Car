import { endOfTomorrow } from "date-fns";
import imageKit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";
import Booking from "../models/Booking.js";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });

    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to add car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    //  Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    //  Parse carData safely
    if (!req.body.carData) {
      return res.status(400).json({
        success: false,
        message: "Car data is required",
      });
    }

    let carData;
    try {
      carData = JSON.parse(req.body.carData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid carData JSON format",
      });
    }

    // Upload image to ImageKit
    const fileBuffer = fs.readFileSync(req.file.path);

    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      folder: "/cars",
    });

    fs.unlinkSync(req.file.path);

    const imageUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [{ width: 400, quality: "auto", format: "webp" }],
    });

    //  Save car to DB
    await Car.create({
      ...carData,
      owner: _id,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//API to list Owner Cars

export const getOwnerCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(endOfTomorrow.message);
    res.json({ success: false, message: error.message });
  }
};

//API to toggle Car Availability
export const toggleCarAvailability = async (res, req) => {
  try {
    const { _id } = req.user;
    const carId = req.body;
    const car = await Car.findById({ carID });

    //Checking if car belong to the user
    if (carId.owner.toString() != _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    Car.isAvailable = !car.isAvailable;
    await car.save();
    res.json({ success: true, message: "Availability Toggle" });
  } catch (error) {
    console.log(endOfTomorrow.message);
    res.json({ success: false, message: error.message });
  }
};

//Api to delete a car
export const deleteCar = async (res, req) => {
  try {
    const { _id } = req.user;
    const carId = req.body;
    const car = await Car.findById({ carID });

    //Checking if car belong to the user
    if (carId.owner.toString() != _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    car.owner = null;
    car.isAvailable = false;
    res.json({ success: true, message: "car remove" });
  } catch (error) {
    console.log(endOfTomorrow.message);
    res.json({ success: false, message: error.message });
  }
};

//Api to comment dashboard data

export const getDashboardData = async (res, req) => {
  try {
    const { _id, role } = req.user;
    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });
    //Calculate monthly Revenue from booking where status is confirmed
    const monthlyRevenue = bookings.slice().filter(booking => booking.status == 'confirmed').reduce((acc, booking) =>acc + booking.price, 0)

    const dashboardData = {
      totalCars : cars.length,
      totalBookings : bookings.length,
      pendingBookings : pendingBookings.length,
      completedBookings : completedBookings.length,
      recentBookings : bookings.slice(0, 3),
      monthlyRevenue
    }
    res.json({success:true, dashboardData});
  } catch (error) {
    console.log(endOfTomorrow.message);
    res.json({ success: false, message: error.message });
  }
};

//