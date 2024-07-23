const mongoose = require('mongoose')

//Created Vendor Schema
/*Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, */
/*A schema defines the structure of the documents within a collection. 
It specifies the fields and their data types, as well as any validation rules or default values. */
const vendorSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'username is required']
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password:{
        type: String,
        required: [true, 'enter valid password']
    },

    /* This is to reltion between vendor modal and firm */
    firm:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Firm'
        }
    ]
})

/*In this we are creatig an modal with first arguent name of the modal and 
second one is name of schema*/
const Vendor = mongoose.model('Vendor', vendorSchema)

//And we are exporting the modal
module.exports = Vendor