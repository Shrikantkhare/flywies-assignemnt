const mongoose= require("mongoose")
const contestSchema=mongoose.Schema({
    match_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Matches',
        required: true  
     },
    price_pool:{
        type:Number,
        require:true,
       default:0
    },
    entry_fee:{
        type:Number,
        require:true,
        default:0
    },
   
    timing:{
        type:Date,
        require:true,
    },
   
},{ timestamps: true })
module.exports=mongoose.model("contest",contestSchema)