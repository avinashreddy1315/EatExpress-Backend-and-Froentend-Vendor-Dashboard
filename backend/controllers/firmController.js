const firmModal = require('../models/firmModal');
const vendorModal = require('../models/vendorModal');
const productModal = require('../models/productModal')
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') //Destination folder where the uploaded image sare stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) // generating unique file name
    }
  })
  
  const upload = multer({ storage: storage })

  const addFirm = async (req, res) => {
    try {
        const { firmName, Area, Offer } = req.body;
        const selectedCategory = req.body.Category.split(',');
        const selectedRegion = req.body.Region.split(',');

        const image = req.file ? req.file.filename : undefined;

        

        // Check if the firm name already exists
        const existingFirm = await firmModal.findOne({ firmName });
        if (existingFirm) {
            return res.status(400).json({ message: "Firm already exists" });
        }

        const vendorData = await vendorModal.findById(req.vendorId);
        if (!vendorData) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if(vendorData.firm.length > 9){
          return res.status(400).json({message : "Vendor can have only maximum 10 firms"})
        }

        const firm = new firmModal({
            firmName,
            Area,
            Category: selectedCategory,
            Region: selectedRegion,
            Offer,
            image,
            vendor: vendorData._id
        });

        const savedFirm = await firm.save();

        vendorData.firm.push(savedFirm);
        await vendorData.save();

        return res.status(200).json({ message: "Firm added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const updateFirmByFirmId = async (req, res) => {
  try {
      const { firmId } = req.params;
      const { firmName, Area, Offer } = req.body;
      const selectedCategory = req.body.Category ? req.body.Category.split(',') : undefined;
      const selectedRegion = req.body.Region ? req.body.Region.split(',') : undefined;

      const image = req.file ? req.file.filename : undefined;

      const firmData = await firmModal.findById(firmId);

      if (!firmData) {
          return res.status(404).json({ message: "Firm not found" });
      }

      // Update firm fields only if they are provided in the request body
      if (firmName !== undefined) firmData.firmName = firmName;
      if (Area !== undefined) firmData.Area = Area;
      if (selectedCategory !== undefined) firmData.Category = selectedCategory;
      if (selectedRegion !== undefined) firmData.Region = selectedRegion;
      if (Offer !== undefined) firmData.Offer = Offer;
      if (image !== undefined) firmData.image = image;

      const updatedFirm = await firmData.save();
      res.status(200).json({ message: "Firm updated", firm: updatedFirm });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};




const deleteFirmById = async (req, res) =>{
  try {
    const firmId = req.params.firmId
     // Find the firm by ID
    const firmData = await firmModal.findById(firmId)
    if(!firmData){
      return res.status(404).json({message : "Firm not found"})
    }
    //update the vendormodal firm array
    const vendorData = await vendorModal.findById(firmData.vendor)

    //delete the related firm Id from vendor firm array and save it
    vendorData.firm = vendorData.firm.filter(firId => firId.toString() !== firmId.toString());
    await vendorData.save();

    //delete all the products associated with firm
    const productDelete = await productModal.deleteMany({firm : firmId})

    //find and delete the firm
    const deletedFirm = await firmModal.findByIdAndDelete(firmId);

    return res.status(200).json({ message: "Firm and associated products deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({message : "Internal server error"})
  }
}

module.exports = { addFirm: [upload.single('image'), addFirm] , deleteFirmById, updateFirmByFirmId: [upload.single('image'), updateFirmByFirmId]};
