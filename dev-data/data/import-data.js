const fs = require('fs');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'})

const Products= require('./../../models/productModels');
const { toUSVString } = require('util');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); 

mongoose.connect(DB).then(()=>console.log("connected to the databse"))

console.log(process.argv)
const product = JSON.parse(fs.readFileSync(`${__dirname}/products.json`,'utf-8' )); 

const importData = async()=>{
  try{
    await Products.create(product);
    console.log("data updated sucessfully")
  }catch(err){
    console.log(err.message)
  }
  process.exit();
}
  const deleteData= async()=>{
    try{
       await Products.deleteMany()
       console.log("data sucessfully deleted")
    }catch(err){
      console.log(err.message)
    }
    process.exit();
  }

  if(process.argv[2]==="--import"){
    importData()
  }else if (process.argv[2]==="--delete")
  {
    deleteData();
  }