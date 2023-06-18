//jshint esversion:6
// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
var bcrypt=require('bcryptjs');
// JSAlert.alert("This is an alert.");
var salt=bcrypt.genSaltSync(10);
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const app = express();
items=[];
index=0;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://Gopi:Gopino.1@cluster0.luogiyd.mongodb.net/test", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    name:String,
mail:{type:String,
    // required:[true,"Enter a Email"],
// validate:[isEmail,"Enter a Valid Email"]
},
password:String,
location:String,
googleId:String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
const maxAge=3*24*60*60;;
const createTOken=(id)=>{
    console.log("12334567");
    return jwt.sign({id},'ninja',{expiresIn:maxAge})
}
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
var ids='';
passport.use(new GoogleStrategy({
    clientID: "790571889832-g2ne0e7m6vr2tl9b0b9c1du2ef6vmg17.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    ids=profile;

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

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
app.post("/Register",async function(req,res){
  var kj=0;
  Model=User;
  name=req.body.name;
  var mail=req.body.mail;
  var password=req.body.password;
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
    Model=User;
    if(req.body.Name){
      try{
          console.log("logging in");
      await Model.create({
          name:req.body.Name,
          mail:req.body.mail,
          password:bcrypt.hashSync(req.body.password,salt)
      });
  }
catch(err){
  console.log(err);
}}
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
              res.redirect("/dashboard");
          }}
          else{
              console.log('running');
          }
          });
      }
      else{
          if (mn===users.length-1){
             // popup.alert("invalid email");
          }
      }

    }
})
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

app.get("/register",async  function(req, res){
    var kj=0;
    Model=User
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
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        console.log(foundUsers)
        console.log(ids)
        res.render("user1",{me:ids.displayName});
      }
    }
  });
});

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