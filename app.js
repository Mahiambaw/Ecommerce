const express = require('express'); 
const morgan = require('morgan');
const porductRouter = require('./routes/porductRouter');
const userRouter = require("./routes/userRouter")
const AppError = require('./utils/AppError')
const globalErrorController= require('./controller/error-controller')

const app= express();

console.log(process.env.NODE_ENV , "hello")

if (process.env.NODE_ENV === 'development'){
  
  app.use(morgan('dev'))
}


// middile ware 
app.use(express.json())


app.use('/api/v1/products',porductRouter)
app.use('/api/v1/users',userRouter)


app.all('*', (req, res, next)=>{
     const err= new AppError(`can't find ${req.originalUrl} on the server`, 404)
       
    next(err)
  
})

app.use(globalErrorController)



module.exports = app; 