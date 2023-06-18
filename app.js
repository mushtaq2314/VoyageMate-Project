
var express=require('express')
app=express()
//Gopi
bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Mushtaq
// app.use(express.urlencoded())

ejs=require('ejs')
app.set('view engine','ejs')
app.use(express.static("public"));
app.listen('3000',function(){
    console.log("started");
})
//HOME
app.get("/",function(request,response){
    response.render("index");
})

//ABOUT
app.get("/about",function(request,response){
    response.render("about");
})

//CONTACT
app.get("/contact",function(request,response){
    response.render("contact");
})

//STATUS
app.get('/status',(req,res)=>{
    res.render('status');
})

app.post('/status',function(req,res){
    res.render('status');
    console.log("clicked");
    console.log(req.body);
})

//LOGIN
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",function(req,res){
    res.render("login");
    console.log(req.body)
})

//BOOK
app.get("/book",function(req,res){
    res.render("book");
})

app.post("/book",function(req,res){
    res.render("book");
    console.log(req.body)
})

