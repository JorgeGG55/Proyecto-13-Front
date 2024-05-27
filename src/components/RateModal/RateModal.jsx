import React from "react";
import { NavLink } from "react-router-dom";
import "./RateModal.css";

const RateModal = ({ book, rating, onRatingChange, onSubmit }) => (
  <div className="rate-container">
    <div className="img-container">
      <NavLink className="navLink" to={`/books/${book._id}`}>
        <img className="book-img" src={book.bookImg} alt={book.title} />
      </NavLink>
    </div>
    <div className="rate-comment-container">
      <div className="post-rate-container">
        <h2 className="postRateTitle">Rate the book</h2>
        <div className="rate">
          {[5, 4, 3, 2, 1].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`star${value}`}
                name="rate"
                value={value}
                onChange={onRatingChange}
              />
              <label htmlFor={`star${value}`} title={`${value} stars`}>
                {`${value} stars`}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
      <button className="postButton" onClick={onSubmit}>
        Post rate
      </button>
    </div>
  </div>
);

export default RateModal;
