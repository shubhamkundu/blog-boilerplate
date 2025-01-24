const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const { id: postId } = req.params;
    const comments = commentsByPostId[postId] || [];
    const comment = req.body;
    comments.push(comment);
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:8000/events', {
        type: 'CommentCreated',
        data: { ...comment, postId: id },
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Received Event:', req.body.type);

    if (req.body.type === 'CommentModerated') {
        const { postId, id, status } = req.body.data;
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => comment.id === id);

        comment.status = status;

        await axios.post('http://event-bus-srv:8000/events', {
            type: 'CommentUpdated',
            data: { ...comment, postId },
        });
    }

    res.send({});
});

const PORT = 8002;
app.listen(PORT, () => {
    console.log(`Comments server is running on port ${PORT}`);
});
