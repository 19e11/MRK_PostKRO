const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");
const postModel = require("./models/postModel");
const cookieParser = require("cookie-parser");
const path = require('path');
const multerConfig = require("./config/multer.config");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/propic", (req, res) => {
  res.render("profileUpload");
});

app.post("/upload",isLoggedIn,multerConfig.single("image") ,async (req, res) => {
  let user = await userModel.findOneAndUpdate({email: req.user.email});
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

app.get("/logout", (req, res) => {
  res.cookie('token', '')
  res.redirect('/login');
});

app.get("/login" , (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req,res)=>{
  let user = await userModel.findOne({email: req.user.email}).populate('post');
  res.render("profile", {user});
});

app.get('/home',isLoggedIn ,async (req,res)=>{
  let post = await postModel.find({}).populate('user').populate('likes')
  res.render('home', {post, currentUser: req.user })
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  try {
    let post = await postModel.findOne({ _id: req.params.id });
    if (post.likes.some(id => id.toString() === req.user.userid)) {
      post.likes.pull(req.user.userid);
    } else {
      post.likes.push(req.user.userid);
    };
    await post.save();
    res.redirect("/home");} 
  catch (err) {
    console.error(err);
    res.status(500).send("Error updating like");
  };
});

app.get("/edit/:id", isLoggedIn, async (req,res)=>{
  let post = await postModel.findOne({_id: req.params.id}).populate('user');
  res.render("edit" , {post});
});

app.post("/update/:id", isLoggedIn, async (req,res)=>{
  let post = await postModel.findOne({_id: req.params.id});
  post.content = req.body.content;
  await post.save();
  res.redirect('/profile');
});

app.post("/post", isLoggedIn, async (req,res)=>{
  let user = await userModel.findOne({email: req.user.email})
  let {content} = req.body;
  let post = await postModel.create({
    user: user._id,
    content,
  });
  user.post.push(post._id);
  await user.save();
  console.log(user.post);
  res.redirect('/profile');
});

app.post("/create", async (req, res) => {
  let { name, username, email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User Existed Already!!");

  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        name,
        username,
        email,
        password:hash,
      });
      if (createdUser) {
        let token = jwt.sign(
          { email: email, userid: createdUser._id, username:createdUser.username, post:createdUser.post }, "sheesh");
        res.cookie("token", token);
        res.redirect('login');
      } else {
        res.status(500).send("User not created");
      }
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Something Went Wrong!!");

  bcrypt.compare(password, user.password,(err,result)=>{
    if (result){
      let token = jwt.sign({email: email, userid: user._id , username:user.username}, 'sheesh');
      res.cookie('token', token);
      res.status(200).redirect('/profile');
    }
    else res.redirect('/login');
  });
});

function isLoggedIn(req,res,next){
  if (req.cookies.token === ""){
    res.send('Your Must Be Logged In!!');
  } 
  else{
    let data = jwt.verify(req.cookies.token, "sheesh");
    req.user = data; 
  }
  next();
}

app.listen(3000, () => {
  console.log("Running!!");
});
