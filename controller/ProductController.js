const { useParams } = require("react-router-dom");
const productModel = require("../models/ProductModel");

//store the products in dataBase
exports.storeproductss = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      images,
      stock,
      numofReview,
      review,
      createdAt,
    } = req.body;

    const ProductData = new productModel({
      name,
      description,
      price,
      category,
      images,
      stock,
      numofReview,
      review,
      createdAt,
    });
    await ProductData.save();
    res.status(200).json({ message: ProductData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get All Product

exports.getAllProduct = async (req, res) => {
  try {
    const ProductData = await productModel.find({});
    res.status(201).json({
      success: true,
      ProductData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//updateProduct
exports.updateProduct = async (req, res) => {
  const { _id } = req.params;
  try {
    const updatedProducts = await productModel.findByIdAndUpdate(_id, req.body);
    res.status(200).json({ success: true, updatedProducts });
    console.log(updatedProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete the products

exports.deleteTheProducts = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedData = await productModel.deleteOne({_id});
    res.status(201).json({ success: true, deletedData: deletedData });
  } catch (err) {
    res.status(201).json({ success: false, error: err.message });
  }
};

//getSingleProduct api
exports.particularProduct = async (req, res) => {

  try{

    const { _id } = req.params;
  const getParticularData =await productModel.findOne({_id});
  res.status(201).json({
    success: true,
    message: getParticularData,
  });

  }catch(error){

    res.status(201).json({
      success: false,
      message: error.message,
    });

  }
  
};
