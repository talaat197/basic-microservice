const express = require("express");
const { randomBytes } = require("crypto");
const bodyParses = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParses.json());
app.use(cors());

const comments = [];

app.get("/posts/:id/comments", (req, res) => {
  res.send(comments[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const postId = req.params.id;
  if (!comments[postId]) {
    comments[postId] = [];
  }
  comments[postId].push({ content, id: commentId, status: "pending" });

  await axios
    .post("http://event-bus-srv:5000/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId,
        status: "pending",
      },
    })
    .catch((e) => console.log(e));

  res.status(201).send(comments[postId]);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status , content } = data;
    const comment = comments[postId].find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios
      .post("http://event-bus-srv:5000/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          status,
          content,
        },
      })
      .catch((e) => {
        console.log(e.message, "Emit Event in Comment Update");
      });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
