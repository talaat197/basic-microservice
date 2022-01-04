import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    const title = comment.status !== "approved" ? comment.status : comment.content;
    return <li key={comment.id}>{title}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
