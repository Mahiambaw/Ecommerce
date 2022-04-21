const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const User = require('../models/userModel'); 
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync');
const signToken = id=>{
  return jwt.sign({id}, 
    process.env.JWT_SECRET, 
    {expiresIn:process.env.JWT_EXPIRES_IN})}



exports.signup = catchAsync(async (req,res,next)=>{
  const newUser = await User.create({ 
    name:req.body.name,
    email:req.body.email,
    password:req.body.password, 
    confirmPassword:req.body.password,
    passwordChangedAt:req.body.passwordChangedAt,
    role:req.body.role
  })
  const token =signToken(newUser._id);
  res.status(200).json({ 
    status:"sucess", 
    token,
    data:{
      user:newUser
    }
  })
});
exports.login= catchAsync( async (req,res,next)=>{
  const {email,password} = req.body;
  
  //1) check if email and password exists 
  if(!email || !password){
   
    return next(new AppError("please provide email and password", 400))
  }
  
 
  // 2)check if the user exists && password correct 
  const user = await User.findOne({email}).select('+password');
  
  if(!user || !(await user.correctPassowrd(password,user.password))){
    return next(new AppError("Incorrect email or password",401))
  }

  // 3) if everything is ok, send token to client 
  const token= signToken(user._id);
  res.status(200).json({ 
    status:"sucess", 
    token
  })
})

exports.protect = catchAsync(async (req,res,next)=>{
  //1. Get the token and check if it exists 
  
  let token ;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

     token = req.headers.authorization.split(' ')[1]
   }
   if(!token){
     return next(new AppError("you are not loged in! please loged in to get acess"),401)
   }
  // 2. Verification token
    const decoded =  await promisify(jwt.verify)(token,process.env.JWT_SECRET,)
  
    console.log(decoded,"💥💥💥")
  // 3) check if the user still exists and
   const newUser=  await User.findById(decoded.id)
   if(!newUser)return next (new AppError("The user with this token does not exist",401))
  // 4. check if user changed password after the JWT was issued
  if(newUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('User recently changed password! Please log in again', 401))
  }
  // Grant Acess to the protected Route 

  req.user= newUser
  next()
})

exports.restrictTo= (...roles)=>{
  return (req,res,next)=>{
    // roles is an array
    if(!roles.includes(req.user.role)){
      return next(new AppError("you do not have permission to pform this action",403))
    }
    next()
  }
    
}
exports.forgotPassword = catchAsync (async (req,res,next)=>{
  //1) get User based on Posted email 
  const user = await User.findOne({email:req.body.email})
    if(!user){
      next (new AppError("no user with that email address"), 404)
    }
  // 2) generate the random reset token
      const resetToken= user.creatPasswordResetToken();
      await user.save({validateBeforeSave:false});

  //3. send it to user's email 
})
