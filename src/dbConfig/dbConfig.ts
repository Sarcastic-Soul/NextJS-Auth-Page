import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('MongoDB connected');
        })

        connection.on('error', (err) => {
            console.log('MongoDB faliled to connect, make sure DB is running', err);
            process.exit(1);
        })
        
    } catch (error) {
        console.log('Something went wrong in connecting to DB', error);
    }
}