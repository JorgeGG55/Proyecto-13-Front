import React, { useEffect, useState } from "react";
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

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await fetch(getBookById(bookId));
        const bookData = await bookResponse.json();
        setBook(bookData);

        const reviewsResponse = await fetch(getReviewsByBookId(bookId));
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        const commentsResponse = await fetch(getCommentsByBookId(bookId));
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
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
      setIsLoading(true);
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
        setBook((prevBook) => ({
          ...prevBook,
          units: prevBook.units - 1,
        }));
      } else {
        toast.error(result.message, { duration: 5000 });
      }
    } catch (error) {
      console.error("Failed to create loan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="firstContainer">
        <div>
          <h1 className="bookTitle">{book.title}</h1>
          <h2 className="bookAuthor">{book.author}</h2>
          <div className="genreContainer">
            {book.genre &&
              book.genre.map((genre, index) => (
                <p key={index} className="genre">
                  {genre}
                </p>
              ))}
          </div>
        </div>

        <img className="bookImg" src={book.bookImg} alt={book.title} />
        <button className="loanButton" onClick={handleLoanBook}>
          <span>{isLoading ? "Loaning Book..." : "Loan Book"}</span>
          {isLoading && <LoadingSpinner />}
        </button>

        <div className="subSecondContainer">
          <StarRating rating={book.rating} totalReviews={reviews.length} />
          <p className="units">{book.units} units available</p>
        </div>
      </div>

      <div className="secondContainer">
        <div className="descriptionContainer">
          <h2 className="descriptionTitle">About</h2>
          <p>{book.description}</p>
        </div>
        <div className="reviewContainer">
          <h2 className="reviewTitle">Customer reviews</h2>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
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
