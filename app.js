const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const app = express();

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/MindfulGurukul');
}

const detailSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    password:String,
    gender:{
        type:String,
        enum: ['male', 'female', 'other']
    },
    about:String,
    city:String,
    state:String
})

const Detail = mongoose.model("Detail",detailSchema);

const personSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    password:String
})

const Persons = mongoose.model("Persons",personSchema);

// Sing Page 
app.get("/signin",(req,res)=>{
    res.render("dashbord/signin.ejs");
})

// Login In Page
app.get("/login",(req,res)=>{
    res.render("dashbord/login.ejs");
})

// Saving into mongo
app.post("/save",async(req,res)=>{
    let{name,email,password,phone,gender,city,state} = req.body.system;
    let detail = await Detail.insertMany([{
        name:name,
        email:email,
        password:password,
        phone:phone,
        gender:gender,
        city:city,
        state:state
    }])

    await detail.save();

    res.redirect(`/validate?email=${email}&password=${password}`);

})


// Valitate 
app.get('/validate',async(req,res)=>{
    const { email, password } = req.query;
    let newdetail = await Detail.findOne({email:email});
    if (newdetail) {
        console.log(newdetail.password);
        console.log(password);
        if (newdetail.password ==password) {
            res.redirect(`${newdetail._id}/dashbord`);
        } else {
            res.send("Your Password did not match");
        }
    } else {
        res.send("Your data was not found");
    }
})
// Show 

app.get("/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let persons = await Persons.findById(id);
    res.render("dashbord/show.ejs", {persons})
})



// Dashbord
app.get("/:id/dashbord",async(req,res)=>{
    let{id}= req.params;
    let person = await Persons.findOne({_id:id})
    if(person){
        let allperson = await Persons.find({});

        res.render("dashbord/dashbord.ejs" ,{persons:allperson});
    }else{
        res.render("dashbord/error.ejs");
    }
    
})


// add User 
app.get("/:id/new",async(req,res)=>{
    let{id}=req.params;
    let detail = await Detail.findOne({_id:id})
    res.render("dashbord/new.ejs",{detail});
})


app.post("/:id/new",async (req,res)=>{
    let{id}=req.params;
    let{name,email,password} = req.body.system;
    let person = await new Persons({name:name,email:email,password:password});
    await person.save();
    res.redirect(`/${id}/dashbord`);
})


// Home Page
app.get("/",(req,res)=>{
    res.send("This is Home Page");
})

app.listen(3000,(req,res)=>{
    console.log("Server is start Working");
})