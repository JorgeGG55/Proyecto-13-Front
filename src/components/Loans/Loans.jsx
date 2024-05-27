import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useModal from "../../hooks/useModal";
import Modal from "../Modal/Modal";
import RateModal from "../RateModal/RateModal";
import CommentModal from "../CommentModal/CommentModal";
import {
  fetchUserLoans,
  finishLoan,
  postComment,
  postRating,
} from "../../utils/APILoans";
import { useAuth } from "../../hooks/useAuth";
import "./Loans.css";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [noLoans, setNoLoans] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    isOpen: isRateModalOpen,
    openModal: openRateModal,
    closeModal: closeRateModal,
  } = useModal();
  const {
    isOpen: isCommentModalOpen,
    openModal: openCommentModal,
    closeModal: closeCommentModal,
  } = useModal();

  const fetchLoans = useCallback(async () => {
    try {
      const fetchedLoans = await fetchUserLoans();
      if (fetchedLoans.length === 0) {
        setNoLoans(true);
      } else {
        setLoans(fetchedLoans);
        setNoLoans(false);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchLoans();
  }, [fetchLoans]);

  const handleFinishLoan = async (loanId) => {
    try {
      const response = await finishLoan(loanId);
      setLoans((prevLoans) => prevLoans.filter((loan) => loan._id !== loanId));
      toast.success(response.message, { duration: 7000 });
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await postComment(selectedBook._id, commentText);
      toast.success("Comment posted. Redirecting...", { duration: 4000 });
      setTimeout(() => {
        navigate(`/books/${selectedBook._id}`);
      }, 3000);
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    }
  };

  const handleRateSubmit = async () => {
    if (!rating) {
      toast.error("The rating cannot be empty", { duration: 7000 });
      return;
    }
    try {
      await postRating(selectedBook._id, rating);
      toast.success("Rating posted. Redirecting...", { duration: 4000 });
      setTimeout(() => {
        navigate(`/books/${selectedBook._id}`);
      }, 3000);
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    }
  };

  return (
    <>
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="loans-container">
        <h2>My loans</h2>
        {noLoans && <p>No loans associated with your account</p>}
        <div className="cards-container">
          {loans.length > 0 ? (
            loans.map((loan) => (
              <div key={loan._id} className="card">
                <img
                  src={loan.book_ID.bookImg}
                  alt={loan.book_ID.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{loan.book_ID.title}</h5>
                  <p className="card-text">
                    Loan date - {new Date(loan.loanDate).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    Return date -{" "}
                    {new Date(loan.returnDate).toLocaleDateString()}
                  </p>
                  <div className="loansButtons">
                    <button
                      className="btn btn-rate"
                      onClick={() => {
                        setSelectedBook(loan.book_ID);
                        openRateModal();
                      }}
                    >
                      Rate
                    </button>
                    <button
                      className="btn btn-comment"
                      onClick={() => {
                        setSelectedBook(loan.book_ID);
                        openCommentModal();
                      }}
                    >
                      Comment
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleFinishLoan(loan._id)}
                    >
                      End loan
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No loans associated with your account</p>
          )}
        </div>
      </div>
      <Modal isOpen={isRateModalOpen} onClose={closeRateModal}>
        {selectedBook && (
          <RateModal
            book={selectedBook}
            rating={rating}
            onRatingChange={(e) => setRating(e.target.value)}
            onSubmit={handleRateSubmit}
          />
        )}
      </Modal>
      <Modal isOpen={isCommentModalOpen} onClose={closeCommentModal}>
        {selectedBook && (
          <CommentModal
            book={selectedBook}
            commentText={commentText}
            onCommentChange={(e) => setCommentText(e.target.value)}
            onSubmit={handleCommentSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default Loans;
