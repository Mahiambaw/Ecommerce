const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title:{
    type:String, 
    required:[true, "A product must have title"],
    unique: true,
    trim:true
  }, 
  price:{
    type:Number, 
    required:[true, "A product must have price"]
  }, 
  description:{
    type:String, 
    trim:true, 
    required:[true, "A product must have description"]
  }, 
  category:{
    type:String, 
    trim:true,
    required:[true, "A product must have a category"]
    
  },
  image:String, 
  CreatedAt:{
    type:Date,
    defualt:Date.now()
  },
  rating:{
    rate:{
      type:Number, 
      defualt:3.9
    }, 
    count:{
      type:Number, 
      defualt:100
    }
  }
})

const Product= mongoose.model('Product', productSchema)
module.exports = Product