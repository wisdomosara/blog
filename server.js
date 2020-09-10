const express = require("express");
const bodyParser  = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require("mongoose")

const app = express()
mongoose.connect("mongodb+srv://Ikhuoria2:Ikhuoria2@cluster0.mn66h.mongodb.net/postsdb", {useNewUrlParser: true, useUnifiedTopology: true})


const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String,
})
const Post = mongoose.model("Post", postSchema)

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use(express.static("public"))

// let items = []
// app.get("/", function(req, res) {
//     let today = new Date();
//     let options = {
//         weekday : "long",
//         month: "long",
//         day: "numeric"
//     }
//     let day = today.toLocaleDateString("en-US", options)
//     res.render("lists", {dayOf: day, item: items})
// })

// app.post("/", function(req, res) {
//     let name  = req.body.name
//     items.push(name)
//     res.redirect("/")
// })
app.get("/", function(req, res) {

    Post.find({},function(err, posts) {
        if(posts.length === 0) {
            res.render("home", {posts:posts})
        }
        else {
            if(err) {
                console.log(err)
            }else {
        
                res.render("home", {posts:posts})
            }
        }
    })
    
})
app.get("/about", function(req, res) {
    res.render("about")
})
app.get("/contact", function(req, res) {
    res.render("contact")
})
app.get("/compose", function(req, res) {
    res.render("compose")
})

app.get("/posts/:new", function(req,res) {
    const title = _.lowerCase(req.params.new);
    Post.findOne({title: title}, function(err, singlePost) {
        if(err) {
            console.log(err)
        }else {
            res.render("post", {postAuthor: singlePost.author, postTitle: singlePost.title, postContent: singlePost.content, postId: singlePost['_id']})
        }
    })
    
    
})
app.post("/delete", function(req,res) {
    console.log(req.body.wisdom)
    Post.deleteOne({_id: req.body.wisdom}, function(err) {
        if(err) {
            console.log(err)
        }else {
            console.log("deleted")
        }
    })
    res.redirect("/")
})
app.post("/compose", function(req, res) {
    let postAuthor = req.body.postAuthor
    let postTitle = req.body.postTitle;
    let postContent = req.body.postContent
    let post = {
        author: postAuthor,
        title: postTitle,
        content: postContent
    }
        const postD = new Post({
            title : post.title,
            author: post.author,
            content: post.content
        })
        postD.save()
    
    res.redirect("/")
}) 


app.listen(3000)