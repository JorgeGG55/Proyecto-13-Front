import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getBooks } from "../../utils/APIRoutes";
import "./HomeSection.css";

const BookItem = ({ book }) => (
  <div className="book-container">
    <NavLink className="navLink" to={`/books/${book._id}`}>
      <img className="booksImage" src={book.bookImg} alt={book.title} />
      <h3 className="booksTitle">{book.title}</h3>
    </NavLink>
    <h4 className="booksAuthor">{book.author}</h4>
  </div>
);

const BookSection = ({ title, books }) => (
  <div className="section">
    <h2 className="section-title">{title}</h2>
    <div className="top-books-container">
      {books.map((book, index) => (
        <BookItem book={book} key={index} />
      ))}
    </div>
  </div>
);

const HomeSection = () => {
  const [randomBooks, setRandomBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(getBooks);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setRandomBooks(getRandomBooks(data, 5));
        setTopRatedBooks(getTopRatedBooks(data, 5));
      } catch (error) {
        setError("Failed to fetch books.");
      }
    };

    fetchBooks();
  }, []);

  const getRandomBooks = (books, count) => {
    return books.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const getTopRatedBooks = (books, count) => {
    return books.sort((a, b) => b.rating - a.rating).slice(0, count);
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <BookSection title="Top Rated Books" books={topRatedBooks} />
      <BookSection title="Random Books" books={randomBooks} />
    </div>
  );
};

export default HomeSection;
