const mongoose= require("mongoose")
const userContestSchema=mongoose.Schema({
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
  
},{ timestamps: true })
module.exports=mongoose.model("userContest",userContestSchema)