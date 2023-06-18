// import JSAlert from 'js-alert'
var express=require('express');
var fs = require('fs');
var bcrypt=require('bcryptjs');
// JSAlert.alert("This is an alert.");
var salt=bcrypt.genSaltSync(10);
var cookieParser=require('cookie-parser');
var {isEmail}=require('validator');
const axios = require('axios');
app=express()
items=[];
index=0;
app.get("/mi",function(req,response){
    response.render('my',{ki:2});
    })
users=[]
//Gopi
var name="";
function Alerting(k){
    alert(k);
}
app.use(cookieParser());
bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const mangoose=require("mongoose");
mangoose.connect("mongodb+srv://Gopi:Gopino.1@cluster0.luogiyd.mongodb.net/test").then(()=>{
    console.log("connected");
});
const Schema=new mangoose.Schema({
name:String,
mail:{type:String,
    required:[true,"Enter a Email"],
validate:[isEmail,"Enter a Valid Email"]},
password:String,
location:String,
})
const maxAge=3*24*60*60;;
const createTOken=(id)=>{
    console.log("12334567");
    return jwt.sign({id},'ninja',{expiresIn:maxAge})
}
const Model=mangoose.model("Model",Schema);
const jwt=require('jsonwebtoken');

//Mushtaq
// app.use(express.urlencoded())

ejs=require('ejs')
app.set('view engine','ejs')
app.use(express.static("public"));
app.listen('3000',function(){
    console.log("started");
})
app.get("/",function(request,response){
    response.render("index");
})
app.get("/services",function(req,res){
    res.render('services');
})
app.get("/status",function(request,response){
    response.render("status",{me:""});
})
app.get("/about",function(request,response){
    response.render("about");
})
app.get("/contact",function(request,response){
    response.render("contact");
})
app.get('/login',function(req,res){
    res.render("login2",{me:'',me1:''});
})
app.post('/login',async function(req,res){
    items=[]
    await Model.find().then(function(users){
        items=users;
    })
    var mail=req.body.mail;
    var password=req.body.password;
    var check=0;
    var k=0;
    var user="";
    for(k=0;k<items.length&&user!=mail;k++){
        name=items[k].user;
        index=k;
        if(mail===items[k].mail){
            user=mail;
            check=1;
            await bcrypt.compare(req.body.password,items[k].password,function(req,response){
            if(response){
                console.log(k);
                const token=createTOken(k);
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                console.log('jwt');
                console.log(token);
            res.redirect("/submit");}
            else{
                res.render("login2",{me:"Incorrect password",me1:""});
            }
        })
        if(check===0 && k===items.length-1 && items[k].mail!=mail){
            res.render("login2",{me:"Incorrect Mail-Id",me1:""});
        }

    }

}
})
app.post("/Register",async function(req,res){
    var kj=0;
    name=req.body.name;
    var mail=req.body.mail;
    var pasword=req.body.password;
    var items=[]
   await Model.find().then(async function(users){
    items=users;
   })
    for (k=0;k<items.length && kj===0;k++){
    if(items[k].mail===mail){
        kj=1;
        res.render("login2",{me:"",me1:"Email Already Exists"});
    }
   }
   if(kj===0){
   await Model.create({
        name:name,
        mail:mail,
        password:bcrypt.hashSync(password,salt)
    })
}
})
app.get("/submit",function(req,res){
    if(req.cookies.jwt){
    res.render("user1",{me:items[index].name});
console.log("Data has been Written");
    }
    else{
        res.redirect("/login");
    }
getLocation();
});
app.get("/contact",function(req,res){
    res.render("contact");
})
app.get("/about",function(req,res){
    res.render("about");

})
app.get("/services",function(req,res){
    res.render("services");
})
app.get("/status",function(req,res){
    res.render("status",{me:""});
})
app.post("/status",async function(req,res){
    const options = {
        method: 'GET',
        url: 'https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus',
        params: {
          trainNo: req.body.Number,
          startDay: '1'
        },
        headers: {
          'content-type': 'application/octet-stream',
          'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
          'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
        }
      };
    m=req.body.number
    try {
        const response = await axios.request(options);
        // console.log(response.data);
        res.render("status",{me:response.data.data.current_location_info[2].message+""+response.data.data.current_location_info[2].label});
    } catch (error) {
        res.render("status",{me:"invalid train number"})
    }
})