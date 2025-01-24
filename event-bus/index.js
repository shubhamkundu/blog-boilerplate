const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/events', (req, res) => {
    res.send(events);
});

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);
    axios.post('http://posts-clusterip-srv:8001/events', event);
    axios.post('http://comments-srv:8002/events', event);
    axios.post('http://query-srv:8003/events', event);
    axios.post('http://moderation-srv:8004/events', event);
    res.status(201).send({ status: 'OK', event });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
