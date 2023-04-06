const orderModel=require("../models/orderModel");


//store all the orders
exports.createUserOrder=async(req,res)=>{
    try{
        const {shippingInformation,orderItems,user,paymentInfo,paidAt,itemsPrice,taxPrice,shippingPrice,totalPrice,orderStatus,deliveredAt,createdAt}=req.body;
        const storeOrder=await orderModel.create({
            shippingInformation,orderItems,user,paymentInfo,paidAt,itemsPrice,taxPrice,shippingPrice,totalPrice,orderStatus,deliveredAt,createdAt
        });

        res.status(201).json({success:true,storeOrder:storeOrder});

    }catch(error){
        res.status(400).json({success:false,error:error.message});
    }
}

//get the single order
exports.getSingleorder=async(req,res)=>{
    const {_id}=req.params;
    try{
     const singleOrder=await orderModel.findById(_id).populate("user","name email"); //populate user of orderSection so we can access user name and emial data
       res.status(201).json({success:true,singleOrder:singleOrder});
    }catch(error){
        res.status(400).json({success:false,error:error.message});
    }
}