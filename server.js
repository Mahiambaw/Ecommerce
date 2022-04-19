const dotenv= require('dotenv');
const mongoose= require('mongoose');
dotenv.config({path:'./config.env'})
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); 

mongoose.connect(DB).then(()=>console.log("connected to the databse"))


const port =3000
app.listen(port, ()=>{
 console.log(`listening to ${port}`)
})