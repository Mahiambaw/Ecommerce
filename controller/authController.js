const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const User = require('../models/userModel'); 
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto= require('crypto')
const signToken = id=>{
  return jwt.sign({id}, 
    process.env.JWT_SECRET, 
    {expiresIn:process.env.JWT_EXPIRES_IN})}

const createSendToken = (user,statusCode,res)=>{
  const token= signToken(user._id);
  res.status(statusCode).json({ 
    status:"sucess", 
    token,
    data:{
      user
    }
  })
}

exports.signup = catchAsync(async (req,res,next)=>{
  const newUser = await User.create({ 
    name:req.body.name,
    email:req.body.email,
    password:req.body.password, 
    confirmPassword:req.body.password,
    passwordChangedAt:req.body.passwordChangedAt,
    role:req.body.role
  })

  createSendToken(newUser,200,res)
  
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
  createSendToken(user,200,res)
  
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
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
      console.log(user.email,"Hello👋")
      await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message:message
    });
    

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    console.error(err)
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword=catchAsync(async(req,res,next)=>{
  //1) get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({passwordResetToken: hashedToken, 
  passwordResetExpires:{$gt:Date.now()}})
  //2) if token has not expired , and thre is user , set the new password to the
  
  if(!user){
    return next(new AppError("Token is invalid or has expired"),400)
  }
  //3. Update changedPasswordAt property for the user object
  user.password = req.body.password
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  console.log(user, "💥💥💥💥")
  await user.save();
  
  
  // log the user in , send JWT for the client 
  createSendToken(user,200,res)
  
})

exports.updatePassword = catchAsync(async (req,res,next)=>{
  //1) get the user from the collection 
  const user = await User.findById(req.user.id).select("+password")
  

  

  //2) the posted current password is correct 
      if(!user || !(await user.correctPassowrd(req.body.passwordCurrent, user.password))){
        
        return next(new AppError("IncorrectPassword"))
      }
      console.log(user, "🧨🧨")
  //3) if so , update password 
  
     user.password = req.body.password
     user.confirmPassword = req.body.confirmPassword
     
       await user.save()
  //4) log user in and send JWT 
  createSendToken(user,200,res)


})