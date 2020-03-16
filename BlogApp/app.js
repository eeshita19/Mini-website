var bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    expressSanitizer =require("express-sanitizer"),
    methodOverride = require("method-override"),
    express=require("express"),
    app=express();

    mongoose.connect("mongodb://127.0.0.1:27017/blog",{useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true});

    app.use(bodyparser.urlencoded({extended: true}));
    app.set("view engine","ejs");    
    app.use(express.static("public"));
   
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));


var blogSchema=new mongoose.Schema({
    title: String,
    image : String,
    body : String,
    created: {type: Date , default: Date.now}
});


var Blog = mongoose.model("blog",blogSchema);


// Blog.create({
//     title: "test blog",
//     image : "https://unsplash.com/photos/7_TTPznVIQI",
//     body : "Hello blog post"
//     });


    //index
    app.get("/",function(req,res){
        res.redirect("/blogs");
    });


    //blog get
    app.get("/blogs",function(req,res){
        Blog.find({},function(err,blogs){
            if(err){
                console.log(err);
            }
            else{
                res.render("index",{blogs:blogs});
            }
        });
        
    });

    //new 
    app.get("/blogs/new",function(req,res){
        res.render("new");
    });
    //blog create post
    app.post("/blogs",function(req,res){
        req.body.blog.body = req.sanitizer(req.body.blog.body);
        //removed script tag
        Blog.create(req.body.blog, function(err , newBlog){
                if(err){
                    res.render("new");
                }
                else{
                    res.redirect("/blogs");
                }
        });
    });
    //show
    app.get("/blogs/:id",function(req,res){
        Blog.findById(req.params.id, function(err,foundBlog){
            if(err){
                res.redirect("/blogs");

            }
            else{
                res.render("show",{blog : foundBlog});
            }
        });
    });

    //edit 
    app.get("/blogs/:id/edit",function(req,res){
        Blog.findById(req.params.id , function(err, foundBlog){
            if(err){
                res.redirect("/blogs");

            }
            else{
                res.render("edit",{blog: foundBlog});
            }
        });
        

    });

    //update

    app.put("/blogs/:id",function(req,res){
        req.body.blog.body = req.sanitizer(req.body.blog.body);
      Blog.findByIdAndUpdate( req.params.id , req.body.blog ,function(err , updatedBlog){
          if(err){
              res.redirect("/blogs");
          }
          else{
              res.redirect("/blogs/" + req.params.id);
          }
      });
    });

//delete
app.delete("/blogs/:id" , function(req,res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


    app.listen(4000,function(){
        console.log("started");
    });