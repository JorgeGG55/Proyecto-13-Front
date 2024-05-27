import React, { useState, useEffect } from "react";
import { getBooks } from "../../utils/APIRoutes";
import BookCard from "../BookCard/BookCard";
import "./BooksList.css";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(getBooks);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, selectedGenre, selectedRating, sortBy]);

  const filterBooks = () => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "All") {
      filtered = filtered.filter((book) => book.genre.includes(selectedGenre));
    }

    if (selectedRating) {
      filtered = filtered.filter(
        (book) => book.rating === parseInt(selectedRating)
      );
    }

    if (sortBy) {
      const [type, direction] = sortBy.split("_");
      const sortOrder = direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => (a[type] - b[type]) * sortOrder);
    }

    setFilteredBooks(filtered);
  };

  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleGenreChange = (event) => setSelectedGenre(event.target.value);
  const handleRatingChange = (event) => setSelectedRating(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setSelectedRating("");
    setSortBy("");
  };

  const isFilterApplied = () =>
    searchTerm || selectedGenre !== "All" || selectedRating || sortBy;

  return (
    <div className="books-section">
      <div className="filters">
        <input
          className="title-input-text"
          type="text"
          placeholder="Search by title or author"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="All">All Genres</option>
          <option value="Ficción">Fiction</option>
          <option value="Misterio">Mystery</option>
          <option value="Fantasía">Fantasy</option>
        </select>
        <select value={selectedRating} onChange={handleRatingChange}>
          <option value="">All Ratings</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="rating_desc">More Rating ↓</option>
          <option value="rating_asc">Less Rating ↑</option>
          <option value="units_desc">More Units ↓</option>
          <option value="units_asc">Less Units ↑</option>
        </select>
        {isFilterApplied() && (
          <button className="clear-button" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
        <div
          className={`results-count ${
            filteredBooks.length === 0 ? "no-books-found" : ""
          }`}
        >
          {filteredBooks.length === 0 ? "" : `${filteredBooks.length} results`}
        </div>
      </div>
      <div
        className={`books-container ${
          filteredBooks.length === 0 ? "no-books-found" : ""
        }`}
      >
        {filteredBooks.length === 0 ? (
          <p className="no-books-message">No books found.</p>
        ) : (
          filteredBooks.map((book) => <BookCard book={book} key={book._id} />)
        )}
      </div>
    </div>
  );
};

export default BooksList;
