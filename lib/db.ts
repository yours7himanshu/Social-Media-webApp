import mongoose from "mongoose";

const MONGO_URI=process.env.MONGO_URI! ;

if(!MONGO_URI){
    throw new Error("Please define mongodb uri in env file");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn:null,promise:null};
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
    const opts = {
        // we are using bufferCommands here because if there is a delay in a database connection then if will store some of the functions such as find() save( ) etc until the connection got ready.
        // if this value is set value then then mongoose will directly return an error if the connection is delayed
        bufferCommands:true,
        // no of connections can be made using the mongodb database
        maxPoolSize:10
    }
    cached.promise = mongoose
    .connect(MONGO_URI,opts)
    .then(()=>mongoose.connection);
    }

    try{
     cached.conn = await cached.promise
    }
    catch(error){
    cached.promise = null;
    throw new Error("Database Connection failed");
    }

    return cached.conn;
}