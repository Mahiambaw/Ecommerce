const User = require('../models/userModel'); 
const catchAsync = require('../utils/catchAsync');



exports.signup = catchAsync(async (req,res,next)=>{
  const newUser = await User.create({ 
    name:req.body.name,
    password:req.body.password, 
    confirmPassword:req.body.password
  })
  res.status(200).json({ 
    status:"sucess", 
    data:{
      user:newUser
    }
  })
});

