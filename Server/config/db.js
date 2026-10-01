const mongoose=require("mongoose");

const connectDb=async ()=>{
    try{
        const connection=await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connectes");

    }
    catch(error){
        console.log(error)
    }
}
module.exports=connectDb