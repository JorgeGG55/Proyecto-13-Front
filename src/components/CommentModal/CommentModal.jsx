import React from "react";
import { NavLink } from "react-router-dom";
import "./CommentModal.css";

const CommentModal = ({ book, commentText, onCommentChange, onSubmit }) => (
  <div className="comment-container">
    <div className="img-container">
      <NavLink className="navLink" to={`/books/${book._id}`}>
        <img className="book-img" src={book.bookImg} alt={book.title} />
      </NavLink>
    </div>
    <div className="rate-comment-container">
      <div className="post-comment-container">
        <h2>Post a comment</h2>
        <textarea
          className="commentBox"
          value={commentText}
          onChange={onCommentChange}
          placeholder="Write your comment here..."
        ></textarea>
        <button className="postButton" onClick={onSubmit}>
          Post comment
        </button>
      </div>
    </div>
  </div>
);

export default CommentModal;
