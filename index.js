import express from 'express';
var users=[];
var blogs=[];
const app=express();
const port=3000;
const auth=false;

var titl="Enter the title";
var con="Create a blog first";
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get("/home",(req,res)=>{
    res.render("index.ejs",{auth});
});
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.get("/membership",(req,res)=>{
    res.render("membership.ejs");
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
})
app.get("/contact",(req,res)=>{
    res.render("contactUs.ejs")
})
app.get("/write",(req,res)=>{
    res.render("write.ejs");
})
app.get("/read",(req,res)=>{
    res.render("read.ejs",{
      blogs:blogs,
    });
})
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
})
app.post("/signup",(req,res)=>{
    users.push(req.body);
    console.log(users);
    console.log("signed up");
    res.render("login.ejs");
})
app.post("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    blogs.splice(id, 1); // remove specific blog
    res.redirect("/read");
  });
  
app.post("/login",(req,res)=>{
    var loggedin=false;
    const user_now=req.body.email;
    const pwd_now=req.body.password;
    for (let i = 0; i < users.length; i++) {
        if (user_now === users[i].email && pwd_now === users[i].password) {
          loggedin = true;
          console.log("Logged in as "+users[i].name);
          return res.render("index.ejs", { auth: true, email: user_now });
        }
      }
    if(loggedin=false){
        console.log("user not found");
        res.render("signup.ejs");
    }

    
})
app.post("/home",(req,res)=>{
    console.log(req.body)
    res.render("index.ejs");
})
app.post("/read",(req,res)=>{
    blogs.push(req.body);
    res.render("read.ejs",{
      blogs:blogs,
    })
})

app.listen(port,(req,res)=>{
    console.log("Running in 3000");
});