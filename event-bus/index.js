const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

const events = []

app.post("/events", (req, res) => {
  const event = req.body;
  
  events.push(event);

  console.log(event, "event happend");

  axios.post("http://posts-clusterip-srv:4000/events", event).catch((error) => console.log(error.message));
  axios.post("http://comments-clusterip-srv:4001/events", event).catch((error) => console.log(error.message));
  axios.post("http://query-clusterip-srv:4002/events", event).catch((error) => console.log(error.message));
  axios.post("http://moderation-clusterip-srv:4005/events", event).catch((error) => console.log(error.message));


  res.send({ status: "OK" });
});

app.get('/events' , (req , res) => {
  res.send(events);
})

app.listen(5000, () => {
  console.log("Event bus on port 5000");
});
