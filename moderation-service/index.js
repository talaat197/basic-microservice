const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
      console.log({test : data});
    let status = data.content.includes('orange') ? "rejected" : "approved";

    await axios.post("http://event-bus-srv:5000/events", {
      type: "CommentModerated",
      data: {
        ...data,
        status,
      },
    }).catch(e => {
        console.log(e.message , 'Emit Event in moderation')
    });
  }

  res.send({})
});

app.listen(4005, () => {
  console.log("Moderation service listen on port 4005");
});
