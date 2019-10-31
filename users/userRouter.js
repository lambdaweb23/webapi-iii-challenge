const express = require('express');

const router = express.Router();
const user = require('./userDb.js');
const post = require('../posts/postDb.js');

// create new user
router.post('/', validateUser, (req, res) => {
    const { name } = req.body;
    user.insert({ name })
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error adding user' });
        })
});

//create new post for user
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    console.log(req);
    const newPost = {text: req.body.text, user_id: req.user.id}
    post.insert(newPost)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Error adding post'});
        })
});

router.get('/', (req, res) => {
    user.get()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Error getting users"});
        })
});

// Get all users
router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

// Get user by id
router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    user.getUserPosts(id)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: `Error getting user post id:${id}`});
        })
});


// Delete user
router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    user.remove(id)
        .then(() => {
            res.status(200).json({ message: `post with id ${id} deleted`});
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({error: `The post with id of ${id} does not exist.`})
        })
});

// Update user
router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    user.update(id, { name })
        .then(updated => {
            if (updated) {
                user.getById(id)
                    .then(user => res.status(200).json(user))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: `Error getting user id ${id}`});
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Error updating user'}); 
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    user.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({error: `Invalid user id of ${id}`});
            }
        })
};

function validateUser(req, res, next) {
    let user = req.body;

    if (!user) {
        res.status(400).json({ message: 'Missing Body' });
        return;
    }
    if (!user.name) {
        res.status(400).json({ message: 'Missing Name' });
        return;
    }
    next();
};

function validatePost(req, res, next) {
    const post = req.body;

    if (!post) {
        res.status(400).json({error: 'Post requires a body'});
    } 
    if (!post.text) {
        res.status(400).json({ error: 'Post requires text' });
    }
    next();
};

module.exports = router;
