import mongoose from "mongoose";


export const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(`${process.env.MONGOURI}/Instagram`,{
            writeConcern:{w:'majority'},

        })

        console.log(`Connected to the database ${connect.connection.host}`)
    }
    catch(err){
        console.log("Database connection error "+err);
        process.exit(1);
    }
}
