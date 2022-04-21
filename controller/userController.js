const User = require('../models/userModel')
const catchAsync= require('../utils/catchAsync')
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

