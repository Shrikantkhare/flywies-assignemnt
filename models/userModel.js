const mongoose= require("mongoose")
const userSchema=mongoose.Schema({
    first_name:{
        type:String,
        require:true,
        default:""
    },
    password:{
        type:String,
        // require:true,
        default:""
    },
    last_name:{
        type:String,
        // require:true,
        default:""
    },
    email:{
        type:String,
        require:true,
        default:""
    },
    phone:{
        type:Number,
        require:true,
    },
    role:{
        type:String,
        require:true,
        default:""
    },
    otp:{
        type:String,
        require:true,
        default:""
    },
    status: {
        type: Boolean,
        default: false
    },
   
},{ timestamps: true })
module.exports=mongoose.model("user",userSchema)