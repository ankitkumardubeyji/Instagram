import bcrypt from "bcrypt"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import crypto from "crypto"



const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:[true,'Name is required'],
        minLength:[5,'Name must be atleast 5 characters'],
        lowercase:true,
        trim:true,
    },

    userName:{
        type:String ,
        required:[true,'username is required'],
        match:[
            /^[A-Za-z][A-Za-z0-9_]{5,19}$/,
            'Please fill in valid username'
        ],
        unique:true, 
        lowercase:true,
        trim:true 
    },

    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], // Matches email against regex

    },

    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[8,'password must be atleast 8 characters'],
        select:false, // will not give password of the user unless explicitly asked
    },

    avatar:{
        public_id:{
            type:String,
        },

        secure_url:{
            type:String,
        }
    },

    phoneNo:{
        type:String,
        required:true 
    }

},{timestamps:true})

// middleware for hashing whenever password is modified before saving to the database

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

// define custom methods related to the user

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateJWTToken = async function(){
    return await jwt.sign(
        {id:this._id,fullName:this.fullName, email:this.email,userName:this.userName},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY 
        }

    )
}

// custom method for regenerating the reset password token

userSchema.generatePasswordResetToken = async function(){
    // creating a random token using the built in crypto module 
    const resetToken = crypto.randomBytes(20).toString('hex');

    // again using the crypto module to hash the generated reset Token
    this.forgetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex') // producing the digits in the hexadecimal format


// adding the forget password expiry to 15 minutes 
    this.forgetPasswordExpiry = Date.now() + 15*60*1000;

    return resetToken;
}

const User = mongoose.model('User',userSchema)

export default User;








