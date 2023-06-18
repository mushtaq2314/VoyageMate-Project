const axios = require("axios");
// import JSAlert from 'js-alert'
var express=require('express')
var bcrypt=require('bcryptjs');
// JSAlert.alert("This is an alert.");
var salt=bcrypt.genSaltSync(10);
var cookieParser=require('cookie-parser');
var {isEmail}=require('validator');
app=express()
app.get("/mi",function(req,response){
    response.render('my',{ki:2});
    })
users=[]
//Gopi
function Alerting(k){
    alert(k);
}
app.use(cookieParser());
bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const mangoose=require("mongoose");
mangoose.connect("mongodb+srv://Md_Mushtaq:mushtaq2314@cluster0.45kcblp.mongodb.net/irctc").then(()=>{
    console.log("connected");
});
const Schema=new mangoose.Schema({
name:String,
mail:{type:String,
    required:[true,"Enter a Email"],
validate:[isEmail,"Enter a Valid Email"]},
password:String
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
    response.render("status");
})
app.get("/about",function(request,response){
    response.render("about");
})
app.get("/contact",function(request,response){
    response.render("contact");
})

app.get('/status',(req,res)=>{
    res.render('status');
})
let trno=00000;
app.post('/status',function(req,res){
    res.render('status');
    console.log("clicked");
    console.log(req.body);
    console.log('trno=',req.body.trno)
    trno = req.body.trno
    //dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250
//srujan
// const options = {
//     method: 'GET',
//     url: 'https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus',
//     params: {trainNo: String(trno), startDay: '0'},
//     headers: {
//       'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
//       'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//     }
//   };
  
//   axios.request(options).then(function (response) {
//       console.log(response.data);
//     console.log(typeof(response.data.current_station_name));
//   }).catch(function (error) {
//       console.error(error);
//   });
  
})
app.get("/login",function(req,res){
    res.render("login2",{me:"",me1:''});
    console.log(trno)
})
app.post("/login", async function(req,res){
    var m=1;
    await Model.find().then(async function(items){
        users=items;});
    if(req.body.Name){
        try{
        for(var i=0;i<users.length;i++){
            if(users[i].mail===req.body.mail){
                m=0;
                break;
               // container.classList.remove("right-panel-active");
            }
        }
    }
catch(err){
    console.log(err);
}
    }
if(!m){
    res.render("login3",{me:'',me1:'Email already exists'});
}
else if(m===1 && req.body.Name){
    await Model.create({
        name:req.body.Name,
        mail:req.body.mail,
        password:bcrypt.hashSync(req.body.password,salt)
    });
}
else if(m==1 &!req.body.Name){
 await Model.find().then(async function(items){
                users=items;});
    // console.log(users);
    
    for(var mn=0;mn<users.length;mn++){
        var k=users[mn]._id;
        if(req.body.mail===users[mn].mail){
            console.log("came");
            console.log(users);
           await bcrypt.compare(req.body.password,users[mn].password,function(req,response){
            if(response){ {
                console.log(k);
                const token=createTOken(k);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                console.log('jwt');
                console.log(token);
                res.redirect("/submit");
            }}
            else{
                console.log('running');
            }
            });
            if(mn===users.length-1){
            res.render('login2',{me:"Incorrect Password or mail-id",me1:''});}
        }
        else{
            if (mn===users.length-1){
              res.render('login2',{me:"Incorrect Password or mail-id",me1:''});
            }
        }

    }
}
}

)
app.get("/submit",function(req,res){
    if(req.cookies.jwt){
        console.log("there");
        res.render('secrets');
    }
    else{
        console.log("not there")
    }
})
app.get("/logout",function(req,res){
    res.cookie('jwt','',{httpOnly:true,maxAge:1});
    res.redirect('/');
})


