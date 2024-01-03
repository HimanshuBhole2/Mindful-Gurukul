const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const personModel = require("./models/user.js");
const ejsMate = require("ejs-mate");



const app = express();
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/MindfulGurukul');
}

// Login
app.get("/login",(req,res)=>{

    res.render("user/login.ejs");
})

// Signin
app.get("/signin",(req,res)=>{
    res.render("user/signin.ejs")
})
app.post("/signin",async (req,res)=>{
    let user1  =new personModel(req.body.person);
    await user1.save()
    res.redirect("/dashbord")
})

// Delete the account details
app.delete("/dashbord/:id",async(req,res)=>{
    let{id} = req.params;
    await personModel.findByIdAndDelete(id);
    res.redirect("/dashbord");
})


// show whole person
app.get("/dashbord/:id/show",async(req,res)=>{
    let{id} = req.params;
    let person = await personModel.findById(id);
    res.render("dashbord/show.ejs",{person});
})

// Edit form
app.get("/dashbord/:id/edit",async(req,res)=>{
    let{id} = req.params;
    let person = await personModel.findById(id);
    res.render("dashbord/edit.ejs",{person:person});
})

app.put("/dashbord/:id",async(req,res)=>{
    let{id} = req.params;
    let person =  await personModel.findByIdAndUpdate(id,{...req.body.person});
    res.redirect(`/dashbord/${id}/show`);
})

// Dashbord
app.get("/dashbord",async(req,res)=>{
    let persons = await personModel.find({});

    res.render("dashbord/dashbord.ejs",{persons});
})


// Home Page
app.get("/",(req,res)=>{
    res.send("This is Home Page");
})

app.listen(3000,(req,res)=>{
    console.log("Server is start Working");
})