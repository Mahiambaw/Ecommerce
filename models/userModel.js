const mongoose= require('mongoose');
const validator= require('validator');

const bcrypt = require('bcryptjs');

userSchema = new mongoose.Schema({
  name:{
    type:String, 
    required:[true, "A user must have a name"],
    trim:true
  },
  email:{
    type:String, 
    requried:[true,"A user must have email"],
    unique:true,
    lowercase:true, 
    validate:[validator.isEmail, "please provide correct emai"],
    trim:true
  },
  photo:String,
  password:{
    type:String, 
    requried: [true, "A user must have a password"], 
    minlength:8,
    trim:true
  },
  confirmPassword:{
    type:String,
    requried: [true, "A user must confirm password"],
    validate:{
      validator:function (el){
        return el===this.password
      }, 
      message:"password do not much"
  }

  }
})
userSchema.pre('save',async function(next){
  if(!this.isModified("password"))return next();
  this.password = await bcrypt.hash(this.password,12);
  this.confirmPassword= undefined;
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;