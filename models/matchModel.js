const mongoose= require("mongoose")
const matchesSchema=mongoose.Schema({
    admin_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true  
    },
    first_team:{
        type:String,
        require:true,
        default:""
    },
    second_team:{
        type:String,
        require:true,
        default:""
    },
    leage_name:{
        type:String,
        require:true,
        default:""
    },
    mega_price:{
        type:Number,
        require:true,
    },
    timing:{
        type:Date,
        require:true,
    },
    first_team_icon:{
        type:String,
        require:true,
        default:""
    },
    second_team_icon:{
        type:String,
        require:true,
        default:""
    },
   
},{ timestamps: true })
module.exports=mongoose.model("matches",matchesSchema)