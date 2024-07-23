const express = require("express"); //importing the express
const app = express() // assigning all the express methods to app
const vendorRoutes = require('./routes/vendorRoutes')
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes')
const bodyParser = require('body-parser')
const path = require('path')

const dotEnv = require('dotenv');
dotEnv.config()

//bodyParser.json() it will convert the incoming data into json formate 
app.use(bodyParser.json())
//toCreate an http request we will use an middle ware caped app.use
//this is all the routes that we can access in vendor routes
app.use('/vendor', vendorRoutes);
//this is all the routes that we can access in firm routes
app.use('/firm', firmRoutes);
//this is all the routes that we can access in product routes
app.use('/product', productRoutes);

//this is for the image uploads
app.use('/uploads', express.static('uploads'));



const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI)
.then(()=>
    console.log("Mongodb connected succesfull")
).catch((error)=>
    console.log(error)
)

const PORT = process.env.PORT || 4000;

/*App.listen is an method to start the server on which port number it will take two
parameters one port and other callback funtion */
app.listen(PORT, ()=>{
    console.log(`SERVER is runing on ${PORT}`)
})


/*with app.use we will create an route when user hit his route it callback function 
will give response if there is no error callback function will take two paratmes 
request and response */
app.use('/', (req, res)=>{
    res.send("<h1>Welcome to EatExpress</h1>")
})