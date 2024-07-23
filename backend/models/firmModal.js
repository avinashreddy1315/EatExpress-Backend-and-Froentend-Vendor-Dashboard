const mongoose = require('mongoose');


const firmSchema = new mongoose.Schema({
    firmName:{
        type: String,
        required: [true, 'Enter Resturent Name'],
        unique: true
    },
    Area:{
        type: String,
        required: [true, 'Enter Your Area']
    },

    /*if we are expecting multiple values we use type define first as array and object and then
      type as string an denum array with the values*/
    Category:{
        type: [{
            type: String,
            enum : ['veg', 'non-veg']
        }],
        required: [true, 'Please Select your Category']
    },
    Region:{
        type: [
            {
                type: String,
                enum: ['south-india', 'north-india', 'chinese', 'bakery']
            }
        ],
        required: [true, 'Please Select your Region']
    },
    Offer:{
        type: String
    },
    image:{
        type: String
    },

    //the below vendor modal is to define the relation between firm modal and vendoe modal 
    vendor:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vendor' // Refers to vendor modal
        }
    ],

    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' 
    }]

})


const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm