const { default: mongoose } = require("mongoose")
require('dotenv').config()


module.exports = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connected succsesfully')
    }catch(e){
        console.log('coudnot connect ot db')
    }
}