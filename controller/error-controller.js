const AppError = require('./../utils/AppError')

const handleDuplicateErrorDB = err=>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate filed value :${value} . Please use another value `
  return new APP.Error(message,404
    )
}
const handleCastErrorDB= err=>{
  const message=`Invalid ${err.path}:${err.value}.`
  return new AppError(message,400)
}

const sendErrorDev= (err, res)=>{
   res.status(err.statusCode).json({
    status:err.status,
    error:err, 
    message:err.message,
    stack:err.stack
  })

}

const sendErrorProd= (err,res)=>{
  // operational, trusted error 
  if(err.isOperational){
    return res.status(err.statusCode).json({
      status:err.status,
      
      message:err.message,
      
    })
  }
  // programming or other unknown error : dont leak details for the client 
    else{
      //1) log error 
      console.error ("ERROR 💥", err)
      //2) send generic message
      res.status(500).json({
        status:"Error",
        message:"Something Went very wrong!!!"
      })
    }
  
  

}


module.exports= (err ,req, res,next)=>{
  
  err.statusCode = err.statusCode || 500; 
  err.status= err.status= err.status || 'error';
   console.log(process.env.NODE_ENV,"🧨")
   
  if(process.env.NODE_ENV === "development"){
    sendErrorDev(err,res)
  }else if(process.env.NODE_ENV === 'production'){
    
    let error = {...err}
       if(error.name=== 'CastError') error= handleCastErrorDB(error)
        if(error.code ===11000) error= handleDuplicateErrorDB(error)
       sendErrorProd(error,res)
  }
  

}