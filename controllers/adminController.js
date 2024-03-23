const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const Matches = require("../models/matchModel")
const Contest =require("../models/contestModel")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const moment = require('moment');

exports.adminregistration = async (req, res) => {
    try {
        const { first_name,last_name, email,phone, password,role, status } = req.body;

        const isUserExist= await User.findOne({phone:phone})
        if(isUserExist !== null){
            return res.status(400).json({ message: "Your account is already exist goto login", status: false })
        }
        let errors = []
        if (!first_name) {
            errors.push({ first_name: "first_name is required!" })
        }
        if (!last_name) {
            errors.push({ last_name: "last_name is required!" })
        }

        if (!email) {
            errors.push({ email: "Email is required!" })
        }
        if (!phone) {
            errors.push({ phone: "phone is required!" })
        }

      
        if (!status) {
            errors.push({ status: "status is required!" })
        }
        if (!password) {
            errors.push({ password: "Password is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }
        const convertpass = await bcrypt.hash(password, 10)
        const creatUser = await User.create({ first_name: first_name,last_name,
             email: email,phone, password: convertpass,status:status,role:role })
        if (creatUser) {
         return res.status(200).json({ message: "user created successfully", status: true })
        }else{
            return res.status(400).json({ message: "Something went wrong", status: false })
        }
    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error,status: false })
    }
}
exports.loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        console.log(req.body);
        let errors = []

        if (!email) {
            errors.push({ email: "Email is required!" })
        }

        if (!password) {
            errors.push({ password: "Password is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }
    const getUserdatas = await User.findOne({ email: email })
    console.log(getUserdatas,"getUserdatas")
            if (getUserdatas !== null) {
                let dbpassword = getUserdatas.password;
                console.log(dbpassword,"dbpassword")
                if (await bcrypt.compare(password, dbpassword)) {
                    jwt.sign({ _id: getUserdatas._id }, process.env.SECRET_KEY, { expiresIn: '24h' }, async (err, token) => {
                        if(err){
                            console.log(err)
                        }
                        res.cookie('token', token, { httpOnly: true });
                        return res.status(200).json({ message: "user login successfully", data: getUserdatas, token, status: true })
                    })
                }
            }else{
                return res.status(400).json({ message: "wrong criadiandial",  status: false })

            }

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error,status: false })
    }
}
exports.createNewMatch = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
          const user_id= jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

    
        const {first_team_icon,first_team,second_team,timing,second_team_icon,
            leage_name,mega_price} =req.body;


            let errors = []

        if (!user_id) {
            errors.push({ user_id: "user_id is required!" })
        }

        
        if (!first_team) {
            errors.push({ first_team: "first_team is required!" })
        }
        if (!second_team) {
            errors.push({ second_team: "second_team is required!" })
        }
        if (!leage_name) {
            errors.push({ leage_name: "leage_name is required!" })
        }
        if (!mega_price) {
            errors.push({ mega_price: "mega_price is required!" })
        }
       
        if (!timing) {
            errors.push({ timing: "timing is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }

        if(first_team_icon){
           var image_filePath = "";

            const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.png`;
            image_filePath = `./public/files/${uniqueFileName}`;
            const targetSizeInKB = 1000;
            await compressAndSaveImage(first_team_icon, image_filePath, targetSizeInKB);
            var relativePath = image_filePath.replace(/^\.\/public/, '');
            console.log("Relative Path:", relativePath);
        }else{
            var relativePath = "";
        }
        if(second_team_icon){
            var image_filePath = "";
 
             const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.png`;
             image_filePath = `./public/files/${uniqueFileName}`;
             const targetSizeInKB = 1000;
             await compressAndSaveImage(second_team_icon, image_filePath, targetSizeInKB);
             var second_path = image_filePath.replace(/^\.\/public/, '');
             console.log("Relative Path:", second_path);
         }else{
             var second_path = "";
         }

       
        const createMatches = await Matches.create({admin_id:user_id,first_team_icon:relativePath,second_team_icon:second_path,
            first_team,second_team,
            leage_name,mega_price,timing})
        if(createMatches){
            return res.status(200).json({ message: 'create Matches successfuly',data:createMatches,status:true })
        }else{
            return res.status(400).json({ message: 'something want wrong',status:false })
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error,status:false })
    }
}
exports.getAllMatchUpcomming = async (req, res) => {
    try {
        
        const currentTime = moment();
        const getallupcomming = await Matches.find({timing:{ $gt: currentTime } })
        if(getallupcomming){
            return res.status(200).json({ message: 'create Matches successfuly',data:getallupcomming,status:true })
        }else{
            return res.status(400).json({ message: 'something want wrong',status:false })
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error,status:false })
    }
}
exports.createNewContest = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
          const user_id= jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

    const match_id =req.params.id;
        const {price_pool,entry_fee,
            timing} =req.body;


            let errors = []

        if (!match_id) {
            errors.push({ match_id: "match_id is required!" })
        }

     
        if (!price_pool) {
            errors.push({ price_pool: "price_pool is required!" })
        }
        if (!entry_fee) {
            errors.push({ entry_fee: "entry_fee is required!" })
        }
        if (!timing) {
            errors.push({ timing: "timing is required!" })
        }
        if (!mega_price) {
            errors.push({ mega_price: "mega_price is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }

       
        const createContest = await Contest.create({match_id:match_id,
            price_pool,entry_fee,
           timing})
        if(createContest){
            return res.status(200).json({ message: 'create Contest successfuly',data:createContest,status:true })
        }else{
            return res.status(400).json({ message: 'something want wrong',status:false })
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error,status:false })
    }
}