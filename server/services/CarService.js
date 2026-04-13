import Car from "../models/Car.js";
import AppError from "../utils/AppError.js";
import imageKit from "../configs/imagekit.js";
import fs from "fs";

class CarService {
  async addCar(ownerId, carData, file) {
    if (!file) throw new AppError("Car image is required", 400);

    // Upload to ImageKit
    const fileBuffer = fs.readFileSync(file.path);
    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: `car-${Date.now()}`,
      folder: "/cars",
    });

    // Cleanup local file
    fs.unlinkSync(file.path);

    const imageUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [{ width: 800, quality: "auto", format: "webp" }],
    });

    const car = await Car.create({
      ...carData,
      owner: ownerId,
      image: imageUrl,
    });

    return car;
  }

  async getOwnerCars(ownerId) {
    return await Car.find({ owner: ownerId, isDeleted: false });
  }

  async getAllCars(filters = {}) {
    const query = { isAvailable: true, isDeleted: false };
    
    if (filters.location) query.location = new RegExp(filters.location, 'i');
    if (filters.category && filters.category !== 'All') query.category = filters.category;
    if (filters.fuel_type) query.fuel_type = filters.fuel_type;
    
    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      query.pricePerDay = {};
      if (filters.minPrice) query.pricePerDay.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.pricePerDay.$lte = Number(filters.maxPrice);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (filters.sortBy === 'priceLow') sortOptions = { pricePerDay: 1 };
    if (filters.sortBy === 'priceHigh') sortOptions = { pricePerDay: -1 };
    if (filters.sortBy === 'rating') sortOptions = { averageRating: -1 };
    
    return await Car.find(query).populate('owner', 'name email image').sort(sortOptions);
  }

  async getCarById(id) {
    const car = await Car.findById(id).populate('owner', 'name email image');
    if (!car || car.isDeleted) throw new AppError("Car not found", 404);
    return car;
  }
}

export default new CarService();
