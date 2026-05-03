import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("✓ Database Connected"))
        
        // Try to connect to MongoDB Atlas first (if MONGODB_URI is provided)
        if (process.env.MONGODB_URI) {
            try {
                await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
                    retryWrites: true,
                    w: "majority"
                })
                console.log("✓ Connected to MongoDB Atlas");
                return;
            } catch (atlasError) {
                console.warn("⚠ MongoDB Atlas connection failed, falling back to local MongoDB...");
            }
        }
        
        // Try to connect to local MongoDB
        try {
            await mongoose.connect("mongodb://localhost:27017/car-rental", {
                retryWrites: true,
                w: "majority",
                serverSelectionTimeoutMS: 3000
            })
            console.log("✓ Connected to Local MongoDB");
            return;
        } catch (localError) {
            console.warn("⚠ Local MongoDB not available, starting in-memory MongoDB...");
        }
        
        // Fall back to in-memory MongoDB (development mode)
        console.log("🚀 Starting MongoDB Memory Server...");
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log("✓ Connected to In-Memory MongoDB (Development Mode)");
        console.log(`📊 Dev DB: ${mongoUri.replace("mongodb://", "").split("/?")[0]}`);
        
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        throw error;
    }
}

// Graceful shutdown
process.on("SIGINT", async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
});

export default connectDB
