const mongoose= require("mongoose")
const userTeamSchema=mongoose.Schema({
    match_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matches',
        required: true  
     },
     user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
     },
     contest_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
        required: true  
     },
     first_plyer:{
        type:String,
        require:true,
        default:""
    },
   
     second_plyer:{
        type:String,
        require:true,
        default:""
    },
      third_plyer:{
        type:String,
        require:true,
        default:""
    }, 
     fourth_plyer:{
        type:String,
        require:true,
        default:""
    }, 
     five_plyer:{
        type:String,
        require:true,
        default:""
    }, 
     six_plyer:{
        type:String,
        require:true,
        default:""
    }, 
     seven_plyer:{
        type:String,
        require:true,
        default:""
    }, 
     eight_plyer:{
        type:String,
        require:true,
        default:""
    },
    nine_plyer:{
        type:String,
        require:true,
        default:""
    },
    ten_plyer:{
        type:String,
        require:true,
        default:""
    },
    eleven_plyer:{
        type:String,
        require:true,
        default:""
    },
  
},{ timestamps: true })
module.exports=mongoose.model("userTeam",userTeamSchema)



