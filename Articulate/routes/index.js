var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Blog = require("../Models/userSchema")
const upload = require("../utils/multer")
const Profile = require("../Models/profileModel")
const fs = require("fs")
const cors = require("cors")
passport.use(new LocalStrategy(Profile.authenticate()));
// passport.use(new LocalStrategy({ usernameField: 'email' }, Profile.authenticate()));

appendFile.use(cors(
  {
    origin: ["mongodb+srv://agrawalritvik05:<password>@cluster0.iles0rj.mongodb.net/?retryWrites=true&w=majority"],
    methods: ["POST" , "GET"],
    credentials: true
  }
))


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect("/login");
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const blogs = await Blog.find()
    res.render('index', { title: 'Articulate' , blogs, isuser: req.user  });
    console.log(req.user)
  } catch (error) {
res.send(error)
  }
});

router.get('/topBlogs',async function (req, res, next) {
  try {
    const blogs = await Blog.find()
    res.render("topBlogs" ,{title: 'Articulate: Top Blogs' , blogs , isuser: req.user  })
  } catch (error) {
res.send(error)
  }
});


router.get('/myBlogs',isLoggedIn ,async function (req, res, next) {
  try {
    const blogs = await Blog.find()
    // blogs.forEach((blog) => {
    //   if(blog.userid == req.user._id){
    //     console.log("hello")}else{console.log("not hello")}
    //   }),
    res.render("myBlogs" ,{title: 'Articulate: My Blogs' , blogs, isuser: req.user  })
  } catch (error) {
res.send(error)
  }
});

router.get('/write', isLoggedIn , function (req, res, next) {
  res.render('write', { title: 'Articulate: Write', isuser: req.user   });
});

router.post('/write', upload.single("image") , async function (req, res, next) {
  // res.json({body:req.body , file: req.file})
  try {
    const newBlog = new Blog({
      heading : req.body.heading,
      image: req.file.filename,
      content: req.body.content, 
      userid: req.body.userid,
      username: req.body.username,   
    })
    await newBlog.save()
    // res.json({body:req.body , file: req.file})
    res.redirect("/topBlogs" )
  } catch (error) {
    res.send(error)
  }
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Articulate: signup' , isuser: req.user });
});

router.post("/signup" , async function(req , res , next){
try{
  const{username , email , password} = req.body;
  // console.log(req.body)
  // if(password){
  //   console.log("Before registration:", username, email, password);
  //   await Profile.register({ username, email }, password);
  //   console.log("After registration" , username, email, password);    
  // res.redirect("/");}else{
  //   res.send("password can not be empty")
  // }

    // register data to the database
    await Profile.register({ username, email }, password);
    res.redirect("/login");

}catch(error){
  res.send(error)
}
})

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Articulate: Login', isuser: req.user });
  // console.log(req.user)
});

router.post("/login",passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/myBlogs",
      
  }),
  function (req, res, next) {}
);

router.get('/update', function (req, res, next) {
  res.render('update', { title: 'Articulate: update', isuser: req.user  });
});

router.get("/blog/:id" , async function(req , res ,next){
  try{
    const blog = await Blog.findById(req.params.id)
    res.render("blog" , {title :"blog" , blog, isuser: req.user })
  }catch(error){
    res.send(error)
  }
});


router.get("/update-blog/:id", async function (req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id)
    res.render("update-blog", { title: "Update", blog , isuser: req.user })
  } catch (error) {
    res.send(error)
  }
})


router.post("/update-blog/:id",upload.single("image") ,async function (req, res, next) {
  try {
    const updatedBlog = {
      heading: req.body.heading,
      image: req.body.oldimage,
      content: req.body.content ,}
      if(req.file){
        fs.unlinkSync(`./public/images/${req.body.oldimage}`)
        updatedBlog.image = req.file.filename
      }
      await Blog.findByIdAndUpdate(req.params.id , updatedBlog)
      res.redirect("/myBlogs")
  } catch (error) {
    res.send(error)
  }
})

router.get("/delete-blog/:id", async function (req, res, next) {
  try {
    const obj = await Blog.findByIdAndDelete(req.params.id)
    fs.unlinkSync(`./public/images/${obj.image}`)
    res.redirect("/myBlogs")
  } catch (error) {
    res.send(error)
  }
})

router.get("/logout", function (req, res, next) {
  req.logout(() => {
      res.redirect("/login");
  });
});

module.exports = router;
