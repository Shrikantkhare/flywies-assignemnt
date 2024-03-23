const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const twilio = require('twilio');
const UserContest = require("../models/userContest")
const UserTeam= require("../models/userTeamModel")

require("dotenv").config();

// const client = twilio(process.env.accountSid, process.env.authToken);

exports.registration = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, role, status } = req.body;

        const isUserExist = await User.findOne({ phone: phone })
        if (isUserExist !== null) {
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
        const creatUser = await User.create({
            first_name: first_name, last_name,
            email: email, phone, password: convertpass, status: status, role: role
        })
        if (creatUser) {
            return res.status(200).json({ message: "user created successfully", status: true })
        } else {
            return res.status(400).json({ message: "Something went wrong", status: false })
        }
    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error, status: false })
    }
}

exports.optSendtoNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).send({ message: 'Phone number is required', status: false });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        // const messageBody = `Your OTP is: ${otp}`;
        // client.messages
        //   .create({
        //     body: messageBody,
        //     from: twilioNumber,
        //     to: phoneNumber
        //   })
        //   .then( async() => {
        //     console.log(`OTP sent successfully to ${phoneNumber}`);
        await User.updateOne({ phone: phoneNumber }, { $set: { otp: otp } })
        return res.status(200).json({ message: 'OTP sent successfully', otp, status: true });
        //   })
        //   .catch((error) => {
        //     console.error('Error sending OTP:', error);
        //    return res.status(500).json('Error sending OTP');
        //   })

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error })
    }
}
exports.otpVerify = async (req, res) => {
    try {
        const { otp, phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required', status: false });
        }
        if (!otp) {
            return res.status(400).json({ message: 'OTP number is required', status: false });
        }

        const getUserdata = await User.findOne({ phone: phoneNumber });
        if (!getUserdata) {
            return res.status(404).json({ message: 'User not found', status: false });
        }


        if (getUserdata.otp === otp) {
            await User.updateOne({ phone: phoneNumber }, { $set: { otp: "" } })
            jwt.sign({ _id: getUserdata._id }, process.env.SECRET_KEY, { expiresIn: '24h' }, async (err, token) => {
                if (err) {
                    console.log(err)
                }
                return res.status(200).json({ message: 'OTP verification successful',token, status: true });
            })

        } else {
            return res.status(400).json({ message: 'Invalid OTP', status: false });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.joinContest = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
        const user_id = jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

        const match_id = req.params.id;

        let errors = []

        if (!match_id) {
            errors.push({ match_id: "match_id is required!" })
        }

        if (!user_id) {
            errors.push({ user_id: "user_id is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }


        const createContest = await UserContest.create({ match_id: match_id, user_id })
        if (createContest) {
            return res.status(200).json({ message: 'create Contest successfuly', data: createContest, status: true })
        } else {
            return res.status(400).json({ message: 'something want wrong', status: false })
        }

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error, status: false })
    }
}
exports.getMyContest = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
        const user_id = jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

        const match_id = req.params.id;

        let errors = []

        if (!match_id) {
            errors.push({ match_id: "match_id is required!" })
        }

        if (!user_id) {
            errors.push({ user_id: "user_id is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }


        const createContest = await UserContest.find({ match_id: match_id, user_id })
        if (createContest.length !== 0) {
            return res.status(200).json({ message: 'create Contest successfuly', data: createContest, status: true })
        } else {
            return res.status(400).json({ message: 'something want wrong', status: false })
        }

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error, status: false })
    }
}
exports.createTeam = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
        const user_id = jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

        const match_id = req.params.id;
        const contest_id = req.params.contest_id;
const {first_plyer,
    second_plyer,
     third_plyer, 
    fourth_plyer, 
    five_plyer ,
    six_plyer ,
    seven_plyer ,
    eight_plyer,
   nine_plyer,
   ten_plyer,
   eleven_plyer} = req.body
        let errors = []

        if (!match_id) {
            errors.push({ match_id: "match_id is required!" })
        }
        if (!contest_id) {
            errors.push({ contest_id: "contest_id is required!" })
        }

        if (!user_id) {
            errors.push({ user_id: "user_id is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }


        const createTeam = await UserTeam.create({ match_id: match_id, user_id,first_plyer,
            contest_id:contest_id, second_plyer,
             third_plyer, 
            fourth_plyer, 
            five_plyer ,
            six_plyer ,
            seven_plyer ,
            eight_plyer,
           nine_plyer,
           ten_plyer,
           eleven_plyer })
        if (createTeam) {
            return res.status(200).json({ message: 'create Contest successfuly', data: createTeam, status: true })
        } else {
            return res.status(400).json({ message: 'something want wrong', status: false })
        }

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error, status: false })
    }
}
exports.getTeam = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated', status: false });
        }

        const asd = token.split(' ');
        const asd1 = asd[1];
        const user_id = jwt.verify(asd1, process.env.SECRET_KEY, (err, decoded) => {
            if (err instanceof jwt.JsonWebTokenError) {
                console.log("Error:", err);
                return res.status(401).json({ message: 'Invalid token', status: false });
            } else {
                // console.log(decoded._id, "decoded._id");
                return decoded._id;
            }
        })

        const match_id = req.params.id;
        const contest_id = req.params.contest_id;

        let errors = []

        if (!match_id) {
            errors.push({ match_id: "match_id is required!" })
        }
        if (!contest_id) {
            errors.push({ contest_id: "contest_id is required!" })
        }

        if (!user_id) {
            errors.push({ user_id: "user_id is required!" })
        }

        if (errors.length > 0) {
            return res.status(422).json({ errors: errors, status: false })
        }


        const findMyteam = await UserTeam.find({ match_id: match_id, user_id,
            contest_id:contest_id})
        if (findMyteam) {
            return res.status(200).json({ message: 'get teams successfuly', data: findMyteam, status: true })
        } else {
            return res.status(400).json({ message: 'something want wrong', status: false })
        }

    } catch (error) {
        return res.status(500).json({ message: 'internel server error', error, status: false })
    }
}