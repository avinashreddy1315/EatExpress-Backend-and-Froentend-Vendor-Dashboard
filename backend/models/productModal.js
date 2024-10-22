const mongoose = require('mongoose')



const productSchema = mongoose.Schema({
    Productname:{
        type: String,
        required: [true, 'Enter Product name']
    },

    price:{
        type: Number,
        required: [true, 'Enter price']
    },

    image:{
        type: String
    },

    category:{
        type: String,
        required: true
    },

    description:{
        type: String
    },

    BestSeller:{
        type:Boolean
    },
    OutofStock:{
        type:Boolean
    },
    firm:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Firm'
        }
    ]


})


const product = mongoose.model('Product', productSchema)

module.exports = product