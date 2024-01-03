const mongoose = require("mongoose");


personSchema = new mongoose.Schema({
    name: String,
    email:{
        type:String,
        required: true,
        unique: true,
    },
    image:{
        type:String,
       
        set:(url)=>url===""?"https://media.istockphoto.com/id/1449032425/photo/shopping-bag-full-of-healthy-food-on-blue.jpg?s=1024x1024&w=is&k=20&c=1O0frg75q_i-00X30b4hr_G_JSwfWEXG40I9RZLyhoY=":url,
    },
    password:String,
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    gender:String,
    city:String,
    state:String
})

module.exports = mongoose.model("persons",personSchema);