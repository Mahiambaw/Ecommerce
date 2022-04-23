const User = require('../models/userModel')
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/AppError')


const filterObj= (obj, ...allowedFields) =>{
  const newObj = {}
  Object.keys(obj).forEach(el=>{
    if (allowedFields.includes(el)){
      newObj[el]= obj[el]

    }
  })
  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
    res.status(200).json({
      status: 'success', 
      result:users.length,
      data:{users}
    })
})
exports.createUser = (req, res) => {
  res.status(200).json({
    message: " create not updated yet"
  })
}

exports.updateMe= catchAsync (async (req,res,next)=>{
  //1) create error if the user POSTS password data 
     if (req.body.password || req.body.confirmPassword){
       return next(new AppError('This route is not for password update. Please use /updateMyPassword'),400)
     }
  //2) update user document 
  
  
  const filteredbody= filterObj(req.body,'name','email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredbody,{new:true, runValidators:true})
  
  
  res.status(200).json({
    status:"sucess",
    data:{
      user:updatedUser
    }

  })
})
exports.deleteMe = catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active:false})
  res.status(204).json({
    status:"sucess",
    data:null
  })
})
exports.getUser = (req, res) => {
  res.status(200).json({
    message: " get user not updated yet"
  })
}
exports.getUser = (req, res) => {
  res.status(200).json({
    message: " get user not updated yet"
  })
}
exports.updateUser = (req, res) => {
  res.status(200).json({
    message: " update user not updated yet"
  })
}
exports.deleteUser = (req, res) => {
  res.status(200).json({
    message: " delete user not updated yet"
  })
}

