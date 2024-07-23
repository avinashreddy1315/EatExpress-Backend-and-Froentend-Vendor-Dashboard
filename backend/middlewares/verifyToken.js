
const vendorModal = require('../models/vendorModal');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv')

dotEnv.config()



const verifyToken = async(req, res, next)=>{
    //req.headers: Commonly used for authentication tokens, content type specifications, caching controls, etc.
    const token = req.headers.token;
    //If token is not avaible send error
    if(!token){
        return res.status(401).json({error : "Token is required"});
    }
    try{
        /*we are decoding and verifying the JWT token that which is ntg but the object_Id from
         the databse by using the jwt.verify which will take token and secrete key  */
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);


        /*Inside the decoded we have an key value pair with vendorId and by using the 
        vendorModal.findById we are verifying weather the vendorId == object_Id */
        const vendorData = await vendorModal.findById(decoded.vendorId);
        if(!vendorData){
            return res.status(404).json({error: "vendor not found"})
        }
        req.vendorId = vendorData._id
        next()
    }catch(error){
        console.error(error)
        return res.status(500).json({error : "Invalid Token"})
    }
}

module.exports = verifyToken