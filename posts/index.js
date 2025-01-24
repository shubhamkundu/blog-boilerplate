const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const { title } = req.body;
    const postId = randomBytes(4).toString('hex');
    const post = { id: postId, title };
    posts[id] = post;

    await axios.post('http://event-bus-srv:8000/events', {
        type: 'PostCreated',
        data: post,
    });

    res.status(201).send(post);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    res.send({});
});

const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Posts server is running on port ${PORT}`);
});
