var express=require('express')
var bcrypt=require('bcryptjs');
var salt=bcrypt.genSaltSync(10);
var cookieParser=require('cookie-parser');
var {isEmail}=require('validator');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

app=express()
users=[]
//Gopi
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
mail:String,
password:String,
googleId:String,
facebookId:String
})
Schema.plugin(passportLocalMongoose);
Schema.plugin(findOrCreate);
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
const maxAge=3*24*60*60;;
const createTOken=(id)=>{
    console.log("12334567");
    return jwt.sign({id},'ninja',{expiresIn:maxAge})
}
const Model=mangoose.model("Model",Schema);
const jwt=require('jsonwebtoken');
const { spawn } = require('child_process');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Model.findById(id, function(err, user) {
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
    id1=profile;
    // console.log(profile);
    // ids=profile;

    Model.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
passport.use(new FacebookStrategy({
  clientID: "817821246616355",
  clientSecret: "c895c102511dccb5a794635d3ff838a9",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  console.log(profile);
  id1=profile;
  Model.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.render('dashboard',{name:id1.displayName,mailid:id1.displayName+"@gmail.com"});
  });
  passport.use(new LinkedInStrategy({
    clientID: "86vwsap7tfpsrw",
    clientSecret: "3KmWBkCjbOBY71CT",
    callbackURL: "http://localhost:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, async function(token, tokenSecret, profile, done) {
    id1=(profile);
    console.log(profile);
    await Model.findOrCreate({ linkedinId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
  ));
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

app.get("/about",function(request,response){
    response.render("about");
})
app.get("/contact",function(request,response){
    response.render("contact");
})
/////////////////////////////////////
app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);
app.get('/auth/linkedin',
  passport.authenticate('linkedin'));

app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.render('dashboard',{name:id1.displayName,mailid:id1.emails[0].value});
  });
app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    console.log(id1);
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });

app.get("/profile",function(request,response){
    response.render("profile");
})
app.get("/status2",function(request,response){
  response.render('status2',{i:1,num:'',src:'',des:'',current:'',alert:''})
})
app.get("/book",function(request,response){
    response.render("book",{data:null});
})
app.get("/pnr",function(request,response){
    response.render("pnr",{i:1});
})
app.get("/history",function(request,response){
    response.render("history");
})
app.get("/help",function(request,response){
    response.render("help");
})
//////////////////////////////////////////////////////////////////////////////////////
app.get('/status',(req,res)=>{
    
    res.render('status',{i:1,num:'',src:'',des:'',current:'',alert:''})
})

app.post('/status',function(req,res){
    // res.render('status');
    console.log("clicked");
    console.log(req.body);
    const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus',
  params: {trainNo: req.body.trno, startDay: '0'},
  headers: {
    'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
    'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
if (response.data.data.message==="Please enter a valid train number"){
    res.render('status',{i:2,num:'',src:'',des:'',current:'',alert:''});
}
  console.log('Current station name: '+response.data.data.current_station_name.slice(0,-1)+'\nCurrent Station Code:'+response.data.data.current_station_code)

  res.render('status',{i:0,num:response.data.data.train_number,src:response.data.data.source,des:response.data.data.destination,current:response.data.data.current_station_name,alert:response.data.data.new_alert_msg})
  }).catch(function (error) {
	console.error(error);
    res.render('status',{i:2,num:'',src:'',des:'',current:'',alert:''});

    // res.send('invalid train number 1');
});
//   res.send('invalid train number');
})
/////////////////////////////



//////////////////////////////////////////////////////////////
//google auth
app.get("/secrets", function(req, res){
  Model.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        // console.log(foundUsers)
        // id1=foundUsers;
        console.log(2);
        console.log(id1)
        console.log(2)
        res.render('dashboard',{name:id1.displayName,mailid:id1.name.familyName+"@gmail.com"});
      }
    }
  });
});
app.post('/status2',function(req,res){
    // res.render('status');
    console.log("clicked");
    console.log(req.body);
    data = {
      status: true,
      message: 'Success',
      timestamp: 1684605407733,
      data: {
        std: '2023-05-20 05:45',
        at_src: false,
        late_update: false,
        new_alert_id: 0,
        seo_train_name: 'Krishna Express',
        train_number: '17405',
        stoppage_number: 0,
        smart_city_id: null,
        data_from: 'NA',
        at_src_dstn: false,
        avg_speed: 0,
        previous_stations: [
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object], [Object], [Object], [Object],
          [Object]
        ],
        current_station_code: 'PAPM',
        platform_number: 0,
        success: true,
        spent_time: 0.058,
        journey_time: 1470,
        update_time: '2023-05-20T23:27:00Z',
        etd: '23:06',
        ir_train_name: 'TIRUPATI - ADILABAD Krishna Express',
        distance_from_source: 785,
        si_no: 138,
        eta: '23:06',
        cur_stn_std: '21:46',
        status_as_of: 'As of few seconds ago',
        source: 'TPTY',
        current_location_info: [ [Object], [Object], [Object] ],
        a_day: 0,
        total_distance: 1227,
        is_ry_eta: true,
        train_name: 'TIRUPATI - ADILABAD Krishna Express',
        destination: 'ADB',
        upcoming_stations: [
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object]]
      }
    }
    upcoming_stations=[
      {
        station_name: '',
        station_lng: 0,
        station_lat: 0,
        station_code: '',
        state_code: '',
        sta: '',
        si_no: 0,
        platform_number: 0,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 0,
        etd: '',
        eta: '',
        distance_from_source: 0,
        distance_from_current_station_txt: '',
        distance_from_current_station: 0,
        arrival_delay: 0,
        a_day: 0
      },
      {
        stoppage_number: 33,
        std: '16:42',
        station_name: 'WARANGAL',
        station_lng: 79.605389,
        station_lat: 17.972937,
        station_code: 'WL',
        state_code: 'TS',
        sta: '16:41',
        smart_city_id: null,
        si_no: 96,
        platform_number: 2,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 4,
        food_available: false,
        etd: '19:24',
        eta_a_min: 1160,
        eta: '19:20',
        distance_from_source: 593,
        distance_from_current_station_txt: 'Next stop 6 kms to go',
        distance_from_current_station: 6,
        day: 0,
        arrival_delay: 159,
        a_day: 0
      },
      {
        stoppage_number: 34,
        std: '16:57',
        station_name: 'KAZIPET JN',
        station_lng: 79.510975,
        station_lat: 17.974161,
        station_code: 'KZJ',
        state_code: 'TS',
        sta: '16:56',
        smart_city_id: null,
        si_no: 98,
        platform_number: 3,
        on_time_rating: 0,
        non_stops: [ [Object], [Object] ],
        halt: 4,
        food_available: false,
        etd: '19:40',
        eta_a_min: 1176,
        eta: '19:36',
        distance_from_source: 603,
        distance_from_current_station_txt: 'Next stop 16 kms to go',
        distance_from_current_station: 16,
        day: 0,
        arrival_delay: 160,
        a_day: 0
      },
      {
        stoppage_number: 35,
        std: '17:35',
        station_name: 'GHANPUR',
        station_lng: 79.3770895,
        station_lat: 17.8508152,
        station_code: 'GNP',
        state_code: 'TS',
        sta: '17:34',
        smart_city_id: null,
        si_no: 101,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '20:05',
        eta_a_min: 1204,
        eta: '20:04',
        distance_from_source: 623,
        distance_from_current_station_txt: 'Next stop 36 kms to go',
        distance_from_current_station: 36,
        day: 0,
        arrival_delay: 150,
        a_day: 0
      },
      {
        stoppage_number: 36,
        std: '17:58',
        station_name: 'RAGHUNATHPALLI',
        station_lng: 79.2551136017,
        station_lat: 17.7562888113,
        station_code: 'RGP',
        state_code: 'TS',
        sta: '17:57',
        smart_city_id: null,
        si_no: 103,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '20:23',
        eta_a_min: 1222,
        eta: '20:22',
        distance_from_source: 640,
        distance_from_current_station_txt: 'Next stop 53 kms to go',
        distance_from_current_station: 53,
        day: 0,
        arrival_delay: 145,
        a_day: 0
      },
      {
        stoppage_number: 37,
        std: '18:07',
        station_name: 'JANGAON',
        station_lng: 79.154434,
        station_lat: 17.724815,
        station_code: 'ZN',
        state_code: 'TS',
        sta: '18:06',
        smart_city_id: null,
        si_no: 105,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '20:36',
        eta_a_min: 1235,
        eta: '20:35',
        distance_from_source: 652,
        distance_from_current_station_txt: 'Next stop 65 kms to go',
        distance_from_current_station: 65,
        day: 0,
        arrival_delay: 149,
        a_day: 0
      },
      {
        stoppage_number: 38,
        std: '18:24',
        station_name: 'ALER',
        station_lng: 79.0478714,
        station_lat: 17.6454853,
        station_code: 'ALER',
        state_code: 'TS',
        sta: '18:23',
        smart_city_id: null,
        si_no: 107,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '20:56',
        eta_a_min: 1255,
        eta: '20:55',
        distance_from_source: 666,
        distance_from_current_station_txt: 'Next stop 79 kms to go',
        distance_from_current_station: 79,
        day: 0,
        arrival_delay: 152,
        a_day: 0
      },
      {
        stoppage_number: 39,
        std: '18:45',
        station_name: 'YADADRI',
        station_lng: 78.94126683,
        station_lat: 17.551288288,
        station_code: 'YADD',
        state_code: null,
        sta: '18:44',
        smart_city_id: null,
        si_no: 110,
        platform_number: 2,
        on_time_rating: 1,
        non_stops: [],
        halt: 1,
        food_available: false,
        etd: '21:13',
        eta_a_min: 1272,
        eta: '21:12',
        distance_from_source: 682,
        distance_from_current_station_txt: 'Next stop 95 kms to go',
        distance_from_current_station: 95,
        day: 0,
        arrival_delay: 148,
        a_day: 0
      },
      {
        stoppage_number: 40,
        std: '18:56',
        station_name: 'BHONGIR',
        station_lng: 78.89883,
        station_lat: 17.525056,
        station_code: 'BG',
        state_code: 'TS',
        sta: '18:55',
        smart_city_id: null,
        si_no: 111,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object], [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '21:22',
        eta_a_min: 1281,
        eta: '21:21',
        distance_from_source: 689,
        distance_from_current_station_txt: 'Next stop 102 kms to go',
        distance_from_current_station: 102,
        day: 0,
        arrival_delay: 146,
        a_day: 0
      },
      {
        stoppage_number: 41,
        std: '19:40',
        station_name: 'CHARLAPALLI',
        station_lng: 78.606019,
        station_lat: 17.458072,
        station_code: 'CHZ',
        state_code: 'TS',
        sta: '19:39',
        smart_city_id: null,
        si_no: 115,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '21:50',
        eta_a_min: 1309,
        eta: '21:49',
        distance_from_source: 723,
        distance_from_current_station_txt: 'Next stop 136 kms to go',
        distance_from_current_station: 136,
        day: 0,
        arrival_delay: 130,
        a_day: 0
      },
      {
        stoppage_number: 42,
        std: '19:50',
        station_name: 'MAULA ALI',
        station_lng: 78.550701,
        station_lat: 17.44057,
        station_code: 'MLY',
        state_code: 'TS',
        sta: '19:49',
        smart_city_id: null,
        si_no: 117,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '22:02',
        eta_a_min: 1321,
        eta: '22:01',
        distance_from_source: 729,
        distance_from_current_station_txt: 'Next stop 142 kms to go',
        distance_from_current_station: 142,
        day: 0,
        arrival_delay: 132,
        a_day: 0
      },
      {
        stoppage_number: 43,
        std: '20:45',
        station_name: 'SECUNDERABAD JN',
        station_lng: 78.501821,
        station_lat: 17.433487,
        station_code: 'SC',
        state_code: 'TS',
        sta: '20:40',
        smart_city_id: null,
        si_no: 119,
        platform_number: 6,
        on_time_rating: 4,
        non_stops: [ [Object], [Object] ],
        halt: 5,
        food_available: true,
        etd: '22:39',
        eta_a_min: 1354,
        eta: '22:34',
        distance_from_source: 735,
        distance_from_current_station_txt: 'Next stop 148 kms to go',
        distance_from_current_station: 148,
        day: 0,
        arrival_delay: 114,
        a_day: 0
      },
      {
        stoppage_number: 44,
        std: '20:55',
        station_name: 'MALKAJGIRI',
        station_lng: 78.529236,
        station_lat: 17.448022,
        station_code: 'MJF',
        state_code: 'TS',
        sta: '20:54',
        smart_city_id: null,
        si_no: 122,
        platform_number: 3,
        on_time_rating: 1,
        non_stops: [
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object]
        ],
        halt: 1,
        food_available: false,
        etd: '23:03',
        eta_a_min: 1382,
        eta: '23:02',
        distance_from_source: 739,
        distance_from_current_station_txt: 'Next stop 152 kms to go',
        distance_from_current_station: 152,
        day: 0,
        arrival_delay: 128,
        a_day: 0
      },
      {
        stoppage_number: 45,
        std: '21:15',
        station_name: 'BOLARUM',
        station_lng: 78.5151467,
        station_lat: 17.5332793,
        station_code: 'BMO',
        state_code: 'TS',
        sta: '21:14',
        smart_city_id: null,
        si_no: 131,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object]
        ],
        halt: 1,
        food_available: false,
        etd: '23:20',
        eta_a_min: 1399,
        eta: '23:19',
        distance_from_source: 749,
        distance_from_current_station_txt: 'Next stop 162 kms to go',
        distance_from_current_station: 162,
        day: 0,
        arrival_delay: 125,
        a_day: 0
      },
      {
        stoppage_number: 46,
        std: '22:15',
        station_name: 'MIRZAPALI',
        station_lng: 78.415089,
        station_lat: 18.017753,
        station_code: 'MZL',
        state_code: 'TS',
        sta: '22:14',
        smart_city_id: null,
        si_no: 142,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '00:12',
        eta_a_min: 1451,
        eta: '00:11',
        distance_from_source: 807,
        distance_from_current_station_txt: 'Next stop 220 kms to go',
        distance_from_current_station: 220,
        day: 1,
        arrival_delay: 117,
        a_day: 1
      },
      {
        stoppage_number: 47,
        std: '22:25',
        station_name: 'AKANAPET',
        station_lng: 78.396549,
        station_lat: 18.111103,
        station_code: 'AKE',
        state_code: 'TS',
        sta: '22:24',
        smart_city_id: null,
        si_no: 144,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object], [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '00:24',
        eta_a_min: 1463,
        eta: '00:23',
        distance_from_source: 817,
        distance_from_current_station_txt: 'Next stop 230 kms to go',
        distance_from_current_station: 230,
        day: 1,
        arrival_delay: 119,
        a_day: 1
      },
      {
        stoppage_number: 48,
        std: '22:55',
        station_name: 'KAMAREDDI',
        station_lng: 78.335438,
        station_lat: 18.32544,
        station_code: 'KMC',
        state_code: 'TS',
        sta: '22:53',
        smart_city_id: null,
        si_no: 148,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object], [Object], [Object], [Object] ],
        halt: 2,
        food_available: false,
        etd: '00:49',
        eta_a_min: 1487,
        eta: '00:47',
        distance_from_source: 844,
        distance_from_current_station_txt: 'Next stop 257 kms to go',
        distance_from_current_station: 257,
        day: 1,
        arrival_delay: 114,
        a_day: 1
      },
      {
        stoppage_number: 49,
        std: '23:35',
        station_name: 'NIZAMABAD',
        station_lng: 78.103008,
        station_lat: 18.678935,
        station_code: 'NZB',
        state_code: 'TS',
        sta: '23:30',
        smart_city_id: null,
        si_no: 153,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object], [Object], [Object] ],
        halt: 10,
        food_available: true,
        etd: '01:46',
        eta_a_min: 1536,
        eta: '01:36',
        distance_from_source: 896,
        distance_from_current_station_txt: 'Next stop 309 kms to go',
        distance_from_current_station: 309,
        day: 1,
        arrival_delay: 126,
        a_day: 1
      },
      {
        stoppage_number: 50,
        std: '00:25',
        station_name: 'BASAR',
        station_lng: 77.938986,
        station_lat: 18.8656,
        station_code: 'BSX',
        state_code: 'TS',
        sta: '00:24',
        smart_city_id: null,
        si_no: 157,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [],
        halt: 2,
        food_available: false,
        etd: '02:10',
        eta_a_min: 1568,
        eta: '02:08',
        distance_from_source: 925,
        distance_from_current_station_txt: 'Next stop 338 kms to go',
        distance_from_current_station: 338,
        day: 1,
        arrival_delay: 104,
        a_day: 1
      },
      {
        stoppage_number: 51,
        std: '00:35',
        station_name: 'DHARMABAD',
        station_lng: 77.8494215012,
        station_lat: 18.8883403101,
        station_code: 'DAB',
        state_code: 'MH',
        sta: '00:34',
        smart_city_id: null,
        si_no: 158,
        platform_number: 1,
        on_time_rating: 0,
        non_stops: [ [Object], [Object], [Object], [Object] ],
        halt: 3,
        food_available: false,
        etd: '02:25',
        eta_a_min: 1582,
        eta: '02:22',
        distance_from_source: 935,
        distance_from_current_station_txt: 'Next stop 348 kms to go',
        distance_from_current_station: 348,
        day: 1,
        arrival_delay: 108,
        a_day: 1
      },
      {
        stoppage_number: 52,
        std: '01:25',
        station_name: 'UMRI',
        station_lng: 77.643042,
        station_lat: 19.04216,
        station_code: 'UMRI',
        state_code: 'MH',
        sta: '01:24',
        smart_city_id: null,
        si_no: 163,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '02:53',
        eta_a_min: 1612,
        eta: '02:52',
        distance_from_source: 964,
        distance_from_current_station_txt: 'Next stop 377 kms to go',
        distance_from_current_station: 377,
        day: 1,
        arrival_delay: 88,
        a_day: 1
      },
      {
        stoppage_number: 53,
        std: '02:40',
        station_name: 'MUDKHED',
        station_lng: 77.509661,
        station_lat: 19.148087,
        station_code: 'MUE',
        state_code: 'MH',
        sta: '02:20',
        smart_city_id: null,
        si_no: 166,
        platform_number: 1,
        on_time_rating: 2,
        non_stops: [ [Object], [Object] ],
        halt: 38,
        food_available: false,
        etd: '03:51',
        eta_a_min: 1633,
        eta: '03:13',
        distance_from_source: 984,
        distance_from_current_station_txt: 'Next stop 397 kms to go',
        distance_from_current_station: 397,
        day: 1,
        arrival_delay: 53,
        a_day: 1
      },
      {
        stoppage_number: 54,
        std: '03:05',
        station_name: 'BHOKAR',
        station_lng: 77.666645,
        station_lat: 19.214075,
        station_code: 'BOKR',
        state_code: 'MH',
        sta: '03:04',
        smart_city_id: null,
        si_no: 169,
        platform_number: 2,
        on_time_rating: 2,
        non_stops: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '04:28',
        eta_a_min: 1707,
        eta: '04:27',
        distance_from_source: 1016,
        distance_from_current_station_txt: 'Next stop 429 kms to go',
        distance_from_current_station: 429,
        day: 1,
        arrival_delay: 83,
        a_day: 1
      },
      {
        stoppage_number: 55,
        std: '03:55',
        station_name: 'HIMAYATNAGAR',
        station_lng: 77.869205,
        station_lat: 19.417059,
        station_code: 'HEM',
        state_code: 'MH',
        sta: '03:54',
        smart_city_id: null,
        si_no: 176,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '05:06',
        eta_a_min: 1745,
        eta: '05:05',
        distance_from_source: 1070,
        distance_from_current_station_txt: 'Next stop 483 kms to go',
        distance_from_current_station: 483,
        day: 1,
        arrival_delay: 71,
        a_day: 1
      },
      {
        stoppage_number: 56,
        std: '04:10',
        station_name: 'SAHARSRAKUND',
        station_lng: 78.008423,
        station_lat: 19.403135,
        station_code: 'SHSK',
        state_code: 'MH',
        sta: '04:09',
        smart_city_id: null,
        si_no: 178,
        platform_number: 1,
        on_time_rating: 1,
        non_stops: [ [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '05:11',
        eta_a_min: 1750,
        eta: '05:10',
        distance_from_source: 1093,
        distance_from_current_station_txt: 'Next stop 506 kms to go',
        distance_from_current_station: 506,
        day: 1,
        arrival_delay: 61,
        a_day: 1
      },
      {
        stoppage_number: 57,
        std: '04:50',
        station_name: 'BODHADI BUJRUG',
        station_lng: 78.1950187683,
        station_lat: 19.4960459853,
        station_code: 'BHBK',
        state_code: 'MH',
        sta: '04:49',
        smart_city_id: null,
        si_no: 181,
        platform_number: 1,
        on_time_rating: 2,
        non_stops: [ [Object] ],
        halt: 1,
        food_available: false,
        etd: '05:43',
        eta_a_min: 1782,
        eta: '05:42',
        distance_from_source: 1137,
        distance_from_current_station_txt: 'Next stop 550 kms to go',
        distance_from_current_station: 550,
        day: 1,
        arrival_delay: 53,
        a_day: 1
      },
      {
        stoppage_number: 58,
        std: '05:10',
        station_name: 'KINWAT',
        station_lng: 78.202915,
        station_lat: 19.618982,
        station_code: 'KNVT',
        state_code: 'MH',
        sta: '05:09',
        smart_city_id: null,
        si_no: 183,
        platform_number: 1,
        on_time_rating: 2,
        non_stops: [ [Object], [Object], [Object], [Object] ],
        halt: 1,
        food_available: false,
        etd: '05:57',
        eta_a_min: 1796,
        eta: '05:56',
        distance_from_source: 1159,
        distance_from_current_station_txt: 'Next stop 572 kms to go',
        distance_from_current_station: 572,
        day: 1,
        arrival_delay: 47,
        a_day: 1
      },
      {
        stoppage_number: 59,
        std: '06:15',
        station_name: 'ADILABAD',
        station_lng: 78.535595,
        station_lat: 19.680414,
        station_code: 'ADB',
        state_code: 'TS',
        sta: '06:15',
        smart_city_id: null,
        si_no: 188,
        platform_number: 1,
        on_time_rating: 4,
        non_stops: [],
        halt: 1061,
        food_available: false,
        etd: '00:19',
        eta_a_min: 1838,
        eta: '06:38',
        distance_from_source: 1227,
        distance_from_current_station_txt: 'Next stop 640 kms to go',
        distance_from_current_station: 640,
        day: 1,
        arrival_delay: 23,
        a_day: 1
      }
    ]
    res.render('status2',{i:0,num:data.data.train_number,src:data.data.source,des:data.data.destination,current:data.data.current_station_name,alert:'Late by 20 min',eta:data.data.eta,etd:data.data.etd,name:data.data.seo_train_name,next:upcoming_stations[1]['station_name']})
//     const axios = require("axios");

// //Srujan: dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250
// //Mushtaq: 72c49e350fmshfe8d7384857c73ap1f5007jsn6c6d948921d8
// const options = {
//   method: 'GET',
//   url: 'https://irctc1.p.rapidapi.com/api/v1/liveTrainStatus',
//   params: {trainNo: req.body.trno, startDay: '0'},
//   headers: {
//     'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
//     'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//   }
// };

// axios.request(options).then(function (response) {
// // 	console.log(response.data);
// if (response.data.data.message==="Please enter a valid train number"){
//     res.render('status2',{i:2,num:'',src:'',des:'',current:'',alert:''});
// }
//   console.log('Current station name: '+response.data.data.current_station_name.slice(0,-1)+'\nCurrent Station Code:'+response.data.data.current_station_code)

//   res.render('status2',{i:0,num:response.data.data.train_number,src:response.data.data.source,des:response.data.data.destination,current:response.data.data.current_station_name,alert:response.data.data.new_alert_msg})
//   }).catch(function (error) {
// 	console.error(error);
//     res.render('status2',{i:2,num:'',src:'',des:'',current:'',alert:''});

    // res.send('invalid train number 1');
// });
//   res.send('invalid train number');
})

//////////////////////////////////////////////////////////////////////////////////////////
app.post('/book',function(req,res){
    console.log(req.body);
    const date = new Date(req.body.date);
    const day = date.getDay();
    const dayNames = ["Sun", "Mon", "Tue","Wed","Thu","Fri","Sat"];  
    console.log("It is a",dayNames[day])
    data = 
{
  status: true,
  message: 'Success',
  timestamp: 1684566653020,
  data: [
    {
      train_number: '57562',
      train_name: 'Mmr Kcg Passenger',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '17:17:00',
      arrival_time: '22:45:00',
      distance: '164',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '57689',
      train_name: 'Nzb Kgc Passenger',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Nizamabad',
      train_origin_station_code: 'NZB',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '05:00:00',
      arrival_time: '09:25:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07794',
      train_name: 'Karimnagar - Kacheguda Demu Express Special',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Peddapalli',
      train_origin_station_code: 'PDPL',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '18:40:00',
      arrival_time: '23:10:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07639',
      train_name: 'Ned Tpty Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '17:17:00',
      arrival_time: '20:50:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07135',
      train_name: 'Ned Qln  Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Kollam',
      train_destination_station_code: 'QLN',
      depart_time: '03:02:00',
      arrival_time: '06:10:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07139',
      train_name: 'Cct Qln Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Adilabad',
      train_origin_station_code: 'ADB',
      train_destination_station: 'Kollam',
      train_destination_station_code: 'QLN',
      depart_time: '02:20:00',
      arrival_time: '06:10:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07098',
      train_name: 'Nsl Kcg Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '05:57:00',
      arrival_time: '09:45:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '01485',
      train_name: 'Pvr Mrj Special',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Pandharpur',
      train_origin_station_code: 'PVR',
      train_destination_station: 'Miraj',
      train_destination_station_code: 'MRJ',
      depart_time: '14:45:00',
      arrival_time: '18:30:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07431',
      train_name: 'Ned Bam Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Brahmapur',
      train_destination_station_code: 'BAM',
      depart_time: '17:42:00',
      arrival_time: '20:45:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07116',
      train_name: 'Jp Hyb Exp Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Jaipur',
      train_origin_station_code: 'JP',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'HYB',
      depart_time: '22:17:00',
      arrival_time: '03:00:00',
      distance: '170',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07126',
      train_name: 'Mdjn Hyb Urs Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Mandawariya',
      train_origin_station_code: 'MDJN',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'HYB',
      depart_time: '06:45:00',
      arrival_time: '13:00:00',
      distance: '170',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '07130',
      train_name: 'Mdjn Kcg Urs Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Mandawariya',
      train_origin_station_code: 'MDJN',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '02:15:00',
      arrival_time: '07:00:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '17232',
      train_name: 'Nsl Ns Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Narasapur',
      train_destination_station_code: 'NS',
      depart_time: '20:05:00',
      arrival_time: '23:15:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07275',
      train_name: 'Cct Lpi Spl',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Bodhan',
      train_origin_station_code: 'BDHN',
      train_destination_station: 'Mahbubnagar',
      train_destination_station_code: 'MBNR',
      depart_time: '05:55:00',
      arrival_time: '10:35:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07595',
      train_name: 'Cct Tpty Spl',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Nizamabad',
      train_origin_station_code: 'NZB',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '05:05:00',
      arrival_time: '09:25:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07487',
      train_name: 'Tirumala Festival Special (pt)',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Cuddapah',
      train_origin_station_code: 'HX',
      train_destination_station: 'Vishakhapatnam',
      train_destination_station_code: 'VSKP',
      depart_time: '17:10:00',
      arrival_time: '20:50:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17019',
      train_name: 'Jp Hyb Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Jaipur',
      train_origin_station_code: 'JP',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'HYB',
      depart_time: '02:55:00',
      arrival_time: '07:30:00',
      distance: '170',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '57564',
      train_name: 'Ned Hyb Pas',
      train_type: 'P',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'HYB',
      depart_time: '02:20:00',
      arrival_time: '07:45:00',
      distance: '170',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '09575',
      train_name: 'Bdts Okha Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Rajkot',
      train_origin_station_code: 'RJT',
      train_destination_station: 'Mahbubnagar',
      train_destination_station_code: 'MBNR',
      depart_time: '14:42:00',
      arrival_time: '17:25:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07008',
      train_name: 'Raxaul - Secunderabad Special Fare Ganga Pushkar Special',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Raxaul',
      train_origin_station_code: 'RXL',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'SC',
      depart_time: '10:05:00',
      arrival_time: '13:00:00',
      distance: '147',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '17214',
      train_name: 'Nsl Ns Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Narasapur',
      train_destination_station_code: 'NS',
      depart_time: '19:47:00',
      arrival_time: '23:00:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '20810',
      train_name: 'Ned Sbp Sf Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Sambalpur',
      train_destination_station_code: 'SBP',
      depart_time: '18:20:00',
      arrival_time: '21:30:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17640',
      train_name: 'Ak Kcg Express',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Akola',
      train_origin_station_code: 'AK',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '16:30:00',
      arrival_time: '20:15:00',
      distance: '165',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07141',
      train_name: 'Awb Qln Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Aurangabad',
      train_origin_station_code: 'AWB',
      train_destination_station: 'Kollam',
      train_destination_station_code: 'QLN',
      depart_time: '03:02:00',
      arrival_time: '06:10:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '18504',
      train_name: 'Snsi Vskp Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Shirdi',
      train_origin_station_code: 'SNSI',
      train_destination_station: 'Vishakhapatnam',
      train_destination_station_code: 'VSKP',
      depart_time: '05:50:00',
      arrival_time: '09:00:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '12719',
      train_name: 'Jp Hyb Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Jaipur',
      train_origin_station_code: 'JP',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'HYB',
      depart_time: '21:30:00',
      arrival_time: '00:55:00',
      distance: '170',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '19713',
      train_name: 'Jaipur Kcg Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Jaipur',
      train_origin_station_code: 'JP',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '02:50:00',
      arrival_time: '07:15:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '17406',
      train_name: 'Krishna Express',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Adilabad',
      train_origin_station_code: 'ADB',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '02:00:00',
      arrival_time: '05:40:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07054',
      train_name: 'Bkn Kcg Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Bikaner',
      train_origin_station_code: 'BKN',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '04:42:00',
      arrival_time: '09:40:00',
      distance: '167',
      class_type: [Array],
      day_of_journey: 3
    },
    {
      train_number: '12766',
      train_name: 'Ami Tpty Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Amravati',
      train_origin_station_code: 'AMI',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '14:20:00',
      arrival_time: '17:30:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17664',
      train_name: 'Ned Tdu Express',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Tandur',
      train_destination_station_code: 'TDU',
      depart_time: '01:00:00',
      arrival_time: '05:15:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '20812',
      train_name: 'Ned Vskp Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Vishakhapatnam',
      train_destination_station_code: 'VSKP',
      depart_time: '18:20:00',
      arrival_time: '21:25:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '16004',
      train_name: 'Nsl Mas Wkly Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Chennai',
      train_destination_station_code: 'MAS',
      depart_time: '21:30:00',
      arrival_time: '00:50:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17418',
      train_name: 'Snsi Tpty Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Shirdi',
      train_origin_station_code: 'SNSI',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '05:50:00',
      arrival_time: '09:10:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '12794',
      train_name: 'Rayalaseema Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nizamabad',
      train_origin_station_code: 'NZB',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '14:10:00',
      arrival_time: '17:15:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07607',
      train_name: 'Pau Tpty Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Purna',
      train_origin_station_code: 'PAU',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '15:22:00',
      arrival_time: '18:35:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17057',
      train_name: 'Devagiri Express',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Mumbai',
      train_origin_station_code: 'CSMT',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'SC',
      depart_time: '11:10:00',
      arrival_time: '14:45:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '19301',
      train_name: 'Dadn Ypr Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Mhow',
      train_origin_station_code: 'DADN',
      train_destination_station: 'Bengaluru',
      train_destination_station_code: 'YPR',
      depart_time: '18:40:00',
      arrival_time: '22:00:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '17063',
      train_name: 'Ajanta Express',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Manmad',
      train_origin_station_code: 'MMR',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'SC',
      depart_time: '05:30:00',
      arrival_time: '08:50:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 2
    },
    {
      train_number: '07189',
      train_name: 'Ned Ed Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nanded',
      train_origin_station_code: 'NED',
      train_destination_station: 'Erode',
      train_destination_station_code: 'ED',
      depart_time: '17:02:00',
      arrival_time: '20:45:00',
      distance: '161',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '12788',
      train_name: 'Nsl Ns Sf Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nagarsul',
      train_origin_station_code: 'NSL',
      train_destination_station: 'Narasapur',
      train_destination_station_code: 'NS',
      depart_time: '20:05:00',
      arrival_time: '23:15:00',
      distance: '160',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07606',
      train_name: 'Ak Tpty Sf  Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Akola',
      train_origin_station_code: 'AK',
      train_destination_station: 'Tirupati',
      train_destination_station_code: 'TPTY',
      depart_time: '14:32:00',
      arrival_time: '17:40:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '07593',
      train_name: 'Cct Sc Spl',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Nizamabad',
      train_origin_station_code: 'NZB',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '14:55:00',
      arrival_time: '18:30:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '17642',
      train_name: 'Nrkr Kcg Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Narkher',
      train_origin_station_code: 'NRKR',
      train_destination_station: 'Hyderabad',
      train_destination_station_code: 'KCG',
      depart_time: '16:30:00',
      arrival_time: '20:15:00',
      distance: '165',
      class_type: [Array],
      day_of_journey: 1
    },
    {
      train_number: '16734',
      train_name: 'Okha Rmm Exp',
      train_type: 'M',
      run_days: [Array],
      train_origin_station: 'Okha',
      train_origin_station_code: 'OKHA',
      train_destination_station: 'Rameswaram',
      train_destination_station_code: 'RMM',
      depart_time: '14:20:00',
      arrival_time: '17:30:00',
      distance: '166',
      class_type: [Array],
      day_of_journey: 2
    }
  ]
}
res.render('book',{data:data.data,src:req.body.src,dst:req.body.dst,day:dayNames[day],date:req.body.date});
    // res.render('book')

//     const axios = require("axios");

// const options = {
//   method: 'GET',
//   url: 'https://irctc1.p.rapidapi.com/api/v2/trainBetweenStations',
//   params: {fromStationCode: req.body.src, toStationCode: req.body.dst},
//   headers: {
//     'X-RapidAPI-Key': 'dae1c185fbmsh95be9cdf96fd443p13e64ejsndb7c59e57250',
//     'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//   }
// };

// axios.request(options).then(function (response) {
// 	// console.log(response.data);
  
//     res.render('book',{data:response.data.data,src:req.body.src,dst:req.body.dst,day:dayNames[day]});
//   }).catch(function (error) {
//     console.error(error);
//   });
})
/////////////////////////////////////////////////////////////////////////////////////////
app.post("/pnr",function(req,res){
  console.log(req.body)
  pnrdata={
    "status": true,
    "message": "Success",
    "timestamp": 1684944662278,
    "data": {
      "Pnr": "8103465236",
      "TrainNo": "17057",
      "TrainName": "DEVAGIRI EXPRESS",
      "Doj": "28-05-2023",
      "BookingDate": "19-05-2023",
      "Quota": "GN",
      "DestinationDoj": "28-05-2023",
      "SourceDoj": "27-05-2023",
      "From": "PBN",
      "To": "NZB",
      "ReservationUpto": "NZB",
      "BoardingPoint": "PBN",
      "Class": "SL",
      "ChartPrepared": false,
      "BoardingStationName": "Parbhani Junction",
      "TrainStatus": "",
      "TrainCancelledFlag": false,
      "ReservationUptoName": "Nizamabad",
      "PassengerCount": 3,
      "PassengerStatus": [
        {
          "Pnr": null,
          "Number": 1,
          "Prediction": null,
          "PredictionPercentage": "100",
          "ConfirmTktStatus": "Confirm",
          "Coach": "S3",
          "Berth": 40,
          "BookingStatus": "CNF S3 40",
          "CurrentStatus": "CNF",
          "CoachPosition": null,
          "BookingBerthNo": "40",
          "BookingCoachId": "S3",
          "BookingStatusNew": "CNF",
          "BookingStatusIndex": "0",
          "CurrentBerthNo": "",
          "CurrentCoachId": "",
          "BookingBerthCode": "SU",
          "CurrentBerthCode": null,
          "CurrentStatusNew": "CNF",
          "CurrentStatusIndex": "0"
        },
        {
          "Pnr": null,
          "Number": 2,
          "Prediction": null,
          "PredictionPercentage": "100",
          "ConfirmTktStatus": "Confirm",
          "Coach": "S3",
          "Berth": 48,
          "BookingStatus": "CNF S3 48",
          "CurrentStatus": "CNF",
          "CoachPosition": null,
          "BookingBerthNo": "48",
          "BookingCoachId": "S3",
          "BookingStatusNew": "CNF",
          "BookingStatusIndex": "0",
          "CurrentBerthNo": "",
          "CurrentCoachId": "",
          "BookingBerthCode": "SU",
          "CurrentBerthCode": null,
          "CurrentStatusNew": "CNF",
          "CurrentStatusIndex": "0"
        },
        {
          "Pnr": null,
          "Number": 3,
          "Prediction": null,
          "PredictionPercentage": "100",
          "ConfirmTktStatus": "Confirm",
          "Coach": "S3",
          "Berth": 32,
          "BookingStatus": "CNF S3 32",
          "CurrentStatus": "CNF",
          "CoachPosition": null,
          "BookingBerthNo": "32",
          "BookingCoachId": "S3",
          "BookingStatusNew": "CNF",
          "BookingStatusIndex": "0",
          "CurrentBerthNo": "",
          "CurrentCoachId": "",
          "BookingBerthCode": "SU",
          "CurrentBerthCode": null,
          "CurrentStatusNew": "CNF",
          "CurrentStatusIndex": "0"
        }
      ],
      "DepartureTime": "07:35",
      "ArrivalTime": "11:08",
      "ExpectedPlatformNo": "1",
      "BookingFare": "435",
      "TicketFare": "435",
      "CoachPosition": "L SLR GS H1 A2 A1 B5 B4 B3 B2 B1 S10 S9 S8 S7 S6 S5 S4 S3 S2 S1 GS SLR",
      "Rating": 3.6,
      "FoodRating": 3.2,
      "PunctualityRating": 3.7,
      "CleanlinessRating": 3.8,
      "SourceName": "Parbhani",
      "DestinationName": "Nizamabad",
      "Duration": "3:33",
      "RatingCount": 1150,
      "HasPantry": false,
      "FromDetails": {
        "category": "A",
        "division": "NED",
        "latitude": "19.2576585",
        "longitude": "76.7735879",
        "state": "MAHARASHTRA",
        "stationCode": "PBN",
        "stationName": "PARBHANI JN."
      },
      "ToDetails": {
        "category": "A",
        "division": "HYB",
        "latitude": "18.6787573",
        "longitude": "78.1035955",
        "state": "ANDHRA PRADESH",
        "stationCode": "NZB",
        "stationName": "NIZAMABAD"
      },
      "BoardingPointDetails": {
        "category": "A",
        "division": "NED",
        "latitude": "19.2576585",
        "longitude": "76.7735879",
        "state": "MAHARASHTRA",
        "stationCode": "PBN",
        "stationName": "PARBHANI JN."
      },
      "ReservationUptoDetails": {
        "category": "A",
        "division": "HYB",
        "latitude": "18.6787573",
        "longitude": "78.1035955",
        "state": "ANDHRA PRADESH",
        "stationCode": "NZB",
        "stationName": "NIZAMABAD"
      }
    }
  }
  res.render("pnr",{data:pnrdata.data,i:0});
  
//   const axios = require('axios');
  
//   const options = {
//     method: 'GET',
//     url: 'https://irctc1.p.rapidapi.com/api/v3/getPNRStatus',
//     params: {
//       pnrNumber: req.body.pnr
//     },
//     headers: {
//       'X-RapidAPI-Key': 'bea9d496e2msh8e936fd3b850333p186413jsn2c7e6fe355b9',
//       'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
//     }
//   };
  
//   axios.request(options).then(function (response) {
//     console.log(response.data);
//     res.render("pnr",{data:response.data.data,i:0});

//   }).catch(function (error) {
//     console.error(error);
//   });
})
/////////////////////////////////////////////////////////////////////////////////////////
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login", async function(req,res){
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
}
)
app.get("/dashboard",function(req,res){
    if(req.cookies.jwt){
        console.log("there");
        res.render('dashboard');
    }
    else{
        console.log("not there")
    }
})
app.get("/logout",function(req,res){
    res.cookie('jwt','',{httpOnly:true,maxAge:1});
    res.redirect('/');
})

//Python Part
const spawner = require('child_process').spawn;

const data_to_pass_in = 'send this data to python file';
const python_process = spawner('python',['model.py',JSON.stringify(data_to_pass_in)]);

python_process.stdout.on('recieved',(recieved)=>{
  console.log('Data recieved from py file is: ',recieved.toString());
});