import mongoose from "mongoose";
export async function connectDB() {
    const maxRetry = 3;
    let attempt = 0;

    while (attempt < maxRetry) {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log("Connected to DB");
            return;
        } catch (err) {
            attempt += 1;
            console.error('[DB] attempt ' + attempt + 'failed')

            if (attempt >= maxRetry) {
                console.error('[DB] Max retry reached. Exit')
                process.exit(1)
            }

            await new Promise((resolve) => setTimeout(resolve, 1000 * Math.min(attempt, 5)));
        }
    }
}

mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Disconnected, Please check again MongoDB Service')
})