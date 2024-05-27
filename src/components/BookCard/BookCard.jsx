import React from "react";
import { NavLink } from "react-router-dom";
import StarRating from "../StarRating/StarRating";
import "./BookCard.css";

const BookCard = ({ book }) => (
  <NavLink className="navLink" to={`/books/${book._id}`} key={book._id}>
    <div className="book-card">
      <div className="content-wrapper">
        <img className="book-card-img" src={book.bookImg} alt={book.title} />
        <div className="book-info">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
          <div className="units-rating-container">
            <div className="stars-container">
              <StarRating rating={book.rating} />
            </div>
            <p className="units-text">{book.units} unidades disponibles</p>
          </div>
        </div>
      </div>
    </div>
  </NavLink>
);

export default BookCard;
