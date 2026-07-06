import mongoose, { mongo } from "mongoose";

async function dbConnect() {
    const dbUri: string | undefined = process.env.DB_CONNECTION_STRING;

    if(!dbUri){
        console.log("Database connection string is missing in .env file");
    }

    try {
        await mongoose.connect(dbUri as string);
    } catch (error) {
        // throw new Error("Could not connect your database");
        console.error("Could not connect your database", error);
        process.exit(1);
    }
}

export default dbConnect;