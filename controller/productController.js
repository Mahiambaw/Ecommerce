const Products = require('../models/productModels')
const fs = require('fs');
const apiFeatures=require('../utils/apiFeatures')
const catchAsync= require('../utils/catchAsync')
const AppError = require('../utils/appError')
// const productsData= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/products.json`))

// exports.checkId = (req, res, next, val) => {
  
//   const id = req.params.id*1;
  
//   if(id> productsData.length){
   
//      return res.status(404).json({
//       status:"fail",
//       message:"Product not found",
//     })
   
//   }
//   next()
// }

exports.alisTopfive=(req,res,next)=>{
 req.query.limit="5"
 req.query.sort="-rating, price", 
 req.query.fields="title,price,rating,category"

  next()
}



exports.getAllProducts = catchAsync(async(req,res, next)=>{
  
  
    const api = new apiFeatures(Products.find(), req.query)
    .filter()
    .sort()
    .litmtedFields()
    .paginate()
    console.log(api, "api")
     const products = await api.query;
    res.status(200).json({
      status: 'success', 
      result:products.length,
      data:{products}
    })
  
 

}
)

exports.creatProduct = catchAsync(async(req,res,next)=>{

    const newProduct= await Products.create(req.body)
    res.status(200).json({
      status: 'success',
      data:{product:newProduct}
  
    })
  
 
}
)
exports.getProduct = catchAsync(async(req,res,next)=>{
  
    const product = await Products.findById(req.params.id)
  if(!product){
     const err = new AppError("product not found with that Id", 404)
     console.log(err, "err from product 🎆🎆🎆🎆🎆🎆")
    return next(err)
  }
res.status(200).json({
 status:"stucess",
 data:{product}
})
  
}
)
exports.updateProduct= catchAsync(async(req,res, next)=>{

   const product = await Products.findByIdAndUpdate(req.params.id, req.body)
   if(!product){
    return next(new AppError("product not found with that Id", 404))
  }
   res.status(200).json({
    status:"scuess",
    data:{product}
   })
 
}
)

exports.deletProduct= catchAsync (async(req,res, next)=>{
  const product = await Products.findByIdAndDelete(req.params.id)
  if(!product){
    return next(new AppError("product not found with that Id", 404))
  }
res.status(200).json({
 status:"stucess",
 message:"no data to be delete"
})
  
}
)