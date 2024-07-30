//This is VendoeController
/*he defined properties of values in the modal to save them in the database and perform curd
opertion we use controllers */

//it will seperate the logic from routes
const dotEnv = require('dotenv') 
dotEnv.config()
const vendarModal  = require('../models/vendorModal');
const firmModal = require('../models/firmModal');
const productModal = require('../models/productModal')
const jwt = require('jsonwebtoken')
const becrypt = require('bcryptjs');
const { response } = require('express');


/* we have to check weather email is alredy registred are not and email should not
match with other email we have convert the email into tokena nd store it in database
all ways we have the hash teh passed and the we have to store the hashed password in databse */

const vendorRegister = async(req, res) =>{
    //req.body: Contains the main data payload of the request, sent in the body of the HTTP request.
    const {username, email, password} = req.body;
    try{
        // Regex pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(399).json({ message: "Invalid email format" });
    }
        
        //This is used to check wether email is alredy registred are not
        //findOne take it as object
        const vendorEmail = await vendarModal.findOne({email})

        //If user is alredy registred it will return email alredy taken
        if(vendorEmail){
            return res.status(400).json({message : "Email already taken"})
        }

        //we are using .hash to hash the password in 10 round security
        const hashedPassword = await becrypt.hash(password, 10)

        /*To store the data coming from from req.body we have to create an instance 
           and stor them in database */
        const newVendor = new vendarModal({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();
        res.status(201).json({message: "Vendor registration succesfully"});
        console.log('vendor registred')
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}


const vendorLogin = async(req, res) =>{
    const {email, password} = req.body
    try{

         // Regex pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(399).json({ message: "Invalid email format" });
    }
    
        //checking if email alredy registred with vendalmodal schema are not
        const vendorData = await vendarModal.findOne({email});

        // comparing the hased password stored in database and passworrd entered
        if(!vendorData || !(await becrypt.compare(password, vendorData.password))){
            return res.status(401).json({error : "Invalid username or password"})
        }
        
        /*we are creating the token with method jwt.sign by assignig object_is in databse
         to vendorId and it is taking jwt_secrete_key  */
        const token = jwt.sign({vendorId: vendorData._id}, process.env.JWT_SECRETE_KEY, {expiresIn : '1h'})
        res.status(200).json({succes: "Login successful", token})
        //console.log(email);
       
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}


/* this one is used to get all the list of the all vedors */
const getAllVendors = async(req, res)=>{
    try {
        //.find() is used quey all the vendors list in vedors collection.
        //.populate() is used to replace the specific field in the collection
        /* with below method we can not only access the vendors collecion but also
        the respective firm collection in that vendor */
        const vendors = await vendarModal.find().populate('firm')
        
        res.status(200).json({vendors})
    } catch (error) {
        console.error(error)
        res.status(500).json({error : "Internal server error"})
    }
}


//this is to get the data of vendor by id
const getVendorById = async(req, res) =>{
    const vendor_Id = req.params.id;
    try {
        const vendorData = await vendarModal.findById(vendor_Id).populate('firm')
        if(!vendorData){
            return res.status(404).json({error : "vendor not found"})
        }
        res.status(200).json({vendorData});
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error : "Internal server error"})
    }
}


const getVendor = async(req, res) =>{
    try {
        const vendorData = await vendarModal.findById(req.vendorId).populate('firm');
        if (!vendorData) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json({vendorData});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error : "Internal server error"})
    }
}


const deleteVendorById = async(req, res)=>{
    try {
       const vendorId = req.params.vendorid;
       //by using the vendorId find the vendor data
       const vendorData = await vendarModal.findById(vendorId);
       if(!vendorData){
        return res.status(404).json({error : "Vendor not found"})
       }

       //Iterate through the frimId in the vendorData
       for(const firmId of vendorData.firm){
        //get the firmData using firmId
        const firmData = await firmModal.findById(firmId)
        //Delete the product which have firmId of above iterated one
        await productModal.deleteMany({firm : firmId});
        // delete the firm by id
        await firmModal.findByIdAndDelete(firmId);
       }
       //Delete the vendor by id
       await vendarModal.findByIdAndDelete(vendorId);
       return res.status(200).json({message : "vendor Deleted"})

    } catch (error) {
        console.error(error);
        return res.status(500).json({error : "Internal server error"})
    }
}


module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById, deleteVendorById, getVendor}