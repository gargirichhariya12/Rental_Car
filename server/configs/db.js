import mongoose from "mongoose";

const DATABASE_NAME = "car-rental";

let mongoServer;

const buildMongoUri = (mongoUri) => {
    if (!mongoUri) return mongoUri;
    try {
        const parsedMongoUri = new URL(mongoUri);

        if (!parsedMongoUri.pathname || parsedMongoUri.pathname === "/") {
            parsedMongoUri.pathname = `/${DATABASE_NAME}`;
        }

        return parsedMongoUri.toString();
    } catch (err) {
        console.warn("Could not parse MONGODB_URI with standard URL parser, using raw URI.");
        return mongoUri;
    }
};

const connectDB = async () => {
    // Prevent multiple connections in serverless or repeated calls
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));

        if (process.env.MONGODB_URI) {
            try {
                const formattedUri = buildMongoUri(process.env.MONGODB_URI);
                await mongoose.connect(formattedUri, {
                    serverSelectionTimeoutMS: 5000
                });
                console.log("Connected to MongoDB Atlas");
                return;
            } catch (atlasError) {
                console.warn("MongoDB Atlas connection failed:", atlasError.message);
                console.warn("Falling back to local MongoDB...");
            }
        }

        try {
            await mongoose.connect(`mongodb://localhost:27017/${DATABASE_NAME}`, {
                serverSelectionTimeoutMS: 3000
            });
            console.log("Connected to Local MongoDB");
            return;
        } catch (localError) {
            console.warn("Local MongoDB not available, starting in-memory MongoDB...");
        }

        if (process.env.NODE_ENV === 'production') {
            throw new Error("No MongoDB connection available in production. Please check MONGODB_URI in environment variables.");
        }

        console.log("Starting MongoDB Memory Server...");
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
        console.log("Connected to In-Memory MongoDB (Development Mode)");
        console.log(`Dev DB: ${mongoUri.replace("mongodb://", "").split("/?")[0]}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

process.on("SIGINT", async () => {
    if (mongoServer) {
        await mongoServer.stop();
    }
});

export default connectDB;
