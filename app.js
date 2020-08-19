var express = require("express"),
   app = express(),
   bodyParser = require("body-parser"),
   mongoose = require("mongoose"),
   Campground = require("./models/campground"),
   Comment = require("./models/comment"),
   flash = require("connect-flash"),
   User = require("./models/user"),
   passport = require("passport"),
   LocalStrategy = require("passport-local"),
   methodOverride = require("method-override"),
   seedDb = require("./seed");
//requiring routes
var commentRoutes = require("./routes/comments"),
   campgroundRoutes = require("./routes/campgrounds"),
   indexRoutes = require("./routes/index");

   require("dotenv/config");

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
mongoose.connect(process.env.DATABASE_URI,
{useNewUrlParser:true,useCreateIndex:true}).then(()=>{
    console.log("Connected to DB!");
}).catch(err => {
   console.log("ERROR: ", err.message)
 });
//mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash()); 
app.use(methodOverride("_method"));
//seedDb();

//Passport configuration
app.use(
   require("express-session")({
      secret: "YelpCamp clone secret message",
      resave: false,
      saveUninitialized: false,
   })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);

//enables the application to run on localhost
var port = process.env.PORT || 3000;
app.listen(port, function () {
   console.log("The YelpCamp server is running - Port: 3000");
});
