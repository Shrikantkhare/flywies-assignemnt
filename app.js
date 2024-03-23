const express = require("express");
const app = express();
require("dotenv").config();
const path = require('path');
const userRouters = require('./routes/userRoutes')
const adminRouters = require('./routes/adminRoutes')

const bodyparser = require("body-parser")
const cors = require("cors")
const mongoose = require('mongoose')



app.use(bodyparser.json({ limit: '100mb' }));
app.use(bodyparser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyparser.json());
app.use(cors())

app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'build')));
// app.get("*", function(req, res) {
//   return res.sendFile(path.resolve(__dirname, 'build','index.html'));
// });

mongoose.connect('mongodb+srv://Shrikantkhare1:Shrikant@cluster0.qch0g.mongodb.net/flywiesAssignment?retryWrites=true&w=majority')
.then(() => { console.log("Database is connected...")
 })

 app.use('/', userRouters)
 app.use('/', adminRouters)

app.listen(5000, () =>
  console.log(`server is running on port 5000`)
);





 