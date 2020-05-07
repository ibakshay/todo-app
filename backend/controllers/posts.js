const Post = require("../models/post")




exports.fetchAllPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    console.log(req.query);
    const postQuery = Post.find({ creator: req.userData.userId });
    if (pageSize && currentPage)
    {
        console.log("akshay is a google boy")
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    console.log("from database");
    postQuery.then(savedPosts => {
        res.status(200).json({
            data: savedPosts
        });
    })
        .catch((error) => res.status(500).json({ message: "failed when fetching all the posts" }));
}

exports.fetchPostById = (req, res, next) => {
    Post.findById(req.params.id).then(response => {
        console.log("hello there" + response)
        if (Post)
        {
            res.status(200).json(response)
        }
        else
        {
            res.status(404).json({ message: "404 page not found" })
        }
    })
}

exports.saveSinglePost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    let post = "";
    if (req.body.filename)
    {
        post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename,
            creator: req.userData.userId
        });
    }
    else
    {
        post = new Post({
            title: req.body.title,
            content: req.body.content,
            creator: req.userData.userId
        });
    }

    post.save().then(createdPost => {
        res.status(201).json({
            message: "data received sucessfully ",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    }).catch(err => {
        res.status(500).json({ message: 'Creating a post failed' })
    });

    console.log(post);
}

exports.editSinglePost = (req, res, next) => {
    console.log("akshay is -----------------> " + req.params.id);
    let imagePath = req.body.imagePath;
    if (req.file)
    {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    //console.log(post)
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(updatedPost => {
        res.status(200).json({
            message: "data updated sucessfully ",
            postId: updatedPost._id
        })
    }).catch(e => { res.status(500).json({ message: 'error occured when updating the post, please try again :) ' }) })
}


exports.deleteSinglePost = (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id
    }).then(res.status(200).json({
        message: "success"
    })).catch(console.log(`Error occurred when deleting data from db `))

}

