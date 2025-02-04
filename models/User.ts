import mongoose, { model,models } from "mongoose";
import bcrypt from 'bcryptjs'


export interface User{
    email:string;
    password:string;
    _id?:mongoose.Types.ObjectId;
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema = new mongoose.Schema<User>({

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
    },
    updatedAt:{
        type:Date,

    }


  
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})
// we are using models here because and checking if User already defined, during the time of development our page often refreshes and our codel runs multiple times , so here in this case User model will have been already defined and there will be no need to create a model again because model already exist , hence we have checked if the User model aready exist then directly return the model and if not it will create the model
const User = models ?.User || model<User>("User",userSchema);

export default User;