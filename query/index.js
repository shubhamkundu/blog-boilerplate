const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = ({ type, body }) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find((comment) => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    console.log('Received Event:', req.body.type);

    handleEvent(req.body);

    res.send({});
});

const PORT = 8003;
app.listen(PORT, async () => {
    console.log(`Query server is running on port ${PORT}`);

    const res = await axios.get('http://event-bus-srv:8000/events');

    for (let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event);
    }
});
