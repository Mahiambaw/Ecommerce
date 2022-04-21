const mongoose= require('mongoose');
const validator= require('validator');
const crypto= require('crypto')
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
    
    trim:true,
  },
  photo:String,
  role:{
    type:String,
  enum:['user','product-manger','admin'], 
  default:'user'
  },
  password:{
    type:String, 
    requried: [true, "A user must have a password"], 
    minlength:8,
    select:false,
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

  },
  passwordChangedAt:{
    type:Date
  },
  passwordResetToken:String,
  passwordResetExpires:Date
})
userSchema.pre('save',async function(next){
  if(!this.isModified("password"))return next();
  this.password = await bcrypt.hash(this.password,12);
  this.confirmPassword= undefined;
  next()
})

userSchema.methods.correctPassowrd= async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter =  function(JWTTimeStamp){
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
    
    return JWTTimeStamp<changedTimestamp
  }
  return false
}

userSchema.methods.creatPasswordResetToken = function(){
  const resetToken =crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken= crypto.createHash('sha256')
  .update(resetToken)
  .digest('hex')
  console.log({resetToken}, this.passwordResetToken)
  this.passwaordResetExpires = Date.now()+10*60*1000
  return resetToken
}
const User = mongoose.model('User', userSchema)
module.exports = User;