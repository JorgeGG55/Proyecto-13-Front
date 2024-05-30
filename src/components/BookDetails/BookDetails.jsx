import React, { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StarRating from "../StarRating/StarRating";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Toaster, toast } from "sonner";
import {
  getBookById,
  getReviewsByBookId,
  getCommentsByBookId,
  createLoan,
} from "../../utils/APIRoutes";
import "./BookDetails.css";

const initialState = {
  book: null,
  reviews: [],
  comments: [],
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_BOOK":
      return { ...state, book: action.payload };
    case "SET_REVIEWS":
      return { ...state, reviews: action.payload };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "DECREMENT_UNITS":
      return { ...state, book: { ...state.book, units: state.book.units - 1 } };
    default:
      return state;
  }
}

const BookDetails = () => {
  const { bookId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await fetch(getBookById(bookId));
        const bookData = await bookResponse.json();
        dispatch({ type: "SET_BOOK", payload: bookData });

        const reviewsResponse = await fetch(getReviewsByBookId(bookId));
        const reviewsData = await reviewsResponse.json();
        dispatch({ type: "SET_REVIEWS", payload: reviewsData });

        const commentsResponse = await fetch(getCommentsByBookId(bookId));
        const commentsData = await commentsResponse.json();
        dispatch({ type: "SET_COMMENTS", payload: commentsData });
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const handleLoanBook = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      const response = await fetch(createLoan(bookId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message, { duration: 7000 });
        dispatch({ type: "DECREMENT_UNITS" });
      } else {
        toast.error(result.message, { duration: 5000 });
      }
    } catch (error) {
      console.error("Failed to create loan:", error);
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  };

  if (!state.book) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="firstContainer">
        <div>
          <h1 className="bookTitle">{state.book.title}</h1>
          <h2 className="bookAuthor">{state.book.author}</h2>
          <div className="genreContainer">
            {state.book.genre &&
              state.book.genre.map((genre, index) => (
                <p key={index} className="genre">
                  {genre}
                </p>
              ))}
          </div>
        </div>

        <img
          className="bookImg"
          src={state.book.bookImg}
          alt={state.book.title}
        />
        <button className="loanButton" onClick={handleLoanBook}>
          <span>{state.isLoading ? "Loaning Book..." : "Loan Book"}</span>
          {state.isLoading && <LoadingSpinner />}
        </button>

        <div className="subSecondContainer">
          <StarRating
            rating={state.book.rating}
            totalReviews={state.reviews.length}
          />
          <p className="units">{state.book.units} units available</p>
        </div>
      </div>

      <div className="secondContainer">
        <div className="descriptionContainer">
          <h2 className="descriptionTitle">About</h2>
          <p className="book-description">{state.book.description}</p>
        </div>
        <div className="reviewContainer">
          <h2 className="reviewTitle">Customer reviews</h2>
          {state.comments.length > 0 ? (
            state.comments.map((comment, index) => (
              <div key={index}>
                <div className="userContainer">
                  <div className="userNameContainer">
                    <img
                      className="userImg"
                      src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-user-20.png&r=0&g=0&b=0"
                      alt=""
                    />
                    <p>{comment.user_ID.name}</p>
                  </div>
                  <div>
                    <p>{formatDate(comment.createdDate)}</p>
                  </div>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>There are no comments for this book yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default BookDetails;
