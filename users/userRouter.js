const express = require('express');

const router = express.Router();
const user = require('./userDb.js');

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

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

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
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

};

function validatePost(req, res, next) {

};

module.exports = router;
