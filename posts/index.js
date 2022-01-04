const express = require("express");
const { randomBytes } = require("crypto");
const bodyParses = require('body-parser');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(bodyParses.json());
app.use(cors())

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post('http://event-bus-srv:5000/events' , {
    type: "PostCreated",
    data : posts[id]
  }).catch((error) => {
    console.log(error.message , 'post created event')
  });

  res.status(201).send(posts[id]);
});

app.post('/events' , (req ,res) => {
  console.log(req.body , 'Event Received');

  res.send({});
})

app.listen(4000, () => {
  console.log('V21');
  console.log("Listening on 4000");
});
