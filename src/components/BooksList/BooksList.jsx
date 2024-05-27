import React, { useEffect, useReducer } from "react";
import { getBooks } from "../../utils/APIRoutes";
import BookCard from "../BookCard/BookCard";
import "./BooksList.css";

const initialState = {
  books: [],
  filteredBooks: [],
  searchTerm: "",
  selectedGenre: "All",
  selectedRating: "",
  sortBy: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_BOOKS":
      return { ...state, books: action.payload };
    case "SET_FILTERED_BOOKS":
      return { ...state, filteredBooks: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SELECTED_GENRE":
      return { ...state, selectedGenre: action.payload };
    case "SET_SELECTED_RATING":
      return { ...state, selectedRating: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        searchTerm: "",
        selectedGenre: "All",
        selectedRating: "",
        sortBy: "",
      };
    default:
      return state;
  }
}

const BooksList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(getBooks);
        const data = await response.json();
        dispatch({ type: "SET_BOOKS", payload: data });
      } catch (error) {
        console.error("Error fetching books: ", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [
    state.books,
    state.searchTerm,
    state.selectedGenre,
    state.selectedRating,
    state.sortBy,
  ]);

  const filterBooks = () => {
    let filtered = [...state.books];

    if (state.searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    if (state.selectedGenre !== "All") {
      filtered = filtered.filter((book) =>
        book.genre.includes(state.selectedGenre)
      );
    }

    if (state.selectedRating) {
      filtered = filtered.filter(
        (book) => book.rating === parseInt(state.selectedRating)
      );
    }

    if (state.sortBy) {
      const [type, direction] = state.sortBy.split("_");
      const sortOrder = direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => (a[type] - b[type]) * sortOrder);
    }

    dispatch({ type: "SET_FILTERED_BOOKS", payload: filtered });
  };

  const handleSearch = (event) =>
    dispatch({ type: "SET_SEARCH_TERM", payload: event.target.value });
  const handleGenreChange = (event) =>
    dispatch({ type: "SET_SELECTED_GENRE", payload: event.target.value });
  const handleRatingChange = (event) =>
    dispatch({ type: "SET_SELECTED_RATING", payload: event.target.value });
  const handleSortChange = (event) =>
    dispatch({ type: "SET_SORT_BY", payload: event.target.value });
  const clearFilters = () => dispatch({ type: "CLEAR_FILTERS" });

  const isFilterApplied = () =>
    state.searchTerm ||
    state.selectedGenre !== "All" ||
    state.selectedRating ||
    state.sortBy;

  return (
    <div className="books-section">
      <div className="filters">
        <input
          className="title-input-text"
          type="text"
          placeholder="Search by title or author"
          value={state.searchTerm}
          onChange={handleSearch}
        />
        <select value={state.selectedGenre} onChange={handleGenreChange}>
          <option value="All">All Genres</option>
          <option value="Ficción">Fiction</option>
          <option value="Misterio">Mystery</option>
          <option value="Fantasía">Fantasy</option>
        </select>
        <select value={state.selectedRating} onChange={handleRatingChange}>
          <option value="">All Ratings</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <select value={state.sortBy} onChange={handleSortChange}>
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
            state.filteredBooks.length === 0 ? "no-books-found" : ""
          }`}
        >
          {state.filteredBooks.length === 0
            ? ""
            : `${state.filteredBooks.length} results`}
        </div>
      </div>
      <div
        className={`books-container ${
          state.filteredBooks.length === 0 ? "no-books-found" : ""
        }`}
      >
        {state.filteredBooks.length === 0 ? (
          <p className="no-books-message">No books found.</p>
        ) : (
          state.filteredBooks.map((book) => (
            <BookCard book={book} key={book._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default BooksList;
