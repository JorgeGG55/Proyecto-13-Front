import React, { useReducer, useEffect, useCallback } from "react";
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

const initialState = {
  loans: [],
  noLoans: false,
  selectedBook: null,
  commentText: "",
  rating: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOANS":
      return {
        ...state,
        loans: action.payload,
        noLoans: action.payload.length === 0,
      };
    case "SET_NO_LOANS":
      return { ...state, noLoans: true };
    case "SET_SELECTED_BOOK":
      return { ...state, selectedBook: action.payload };
    case "SET_COMMENT_TEXT":
      return { ...state, commentText: action.payload };
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "REMOVE_LOAN":
      return {
        ...state,
        loans: state.loans.filter((loan) => loan._id !== action.payload),
      };
    default:
      return state;
  }
}

const Loans = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
        dispatch({ type: "SET_NO_LOANS" });
      } else {
        dispatch({ type: "SET_LOANS", payload: fetchedLoans });
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
      dispatch({ type: "REMOVE_LOAN", payload: loanId });
      toast.success(response.message, { duration: 7000 });
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await postComment(state.selectedBook._id, state.commentText);
      toast.success("Comment posted", { duration: 4000 });
      closeCommentModal();
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
      closeCommentModal();
    }
  };

  const handleRateSubmit = async () => {
    if (!state.rating) {
      toast.error("The rating cannot be empty", { duration: 7000 });
      return;
    }
    try {
      await postRating(state.selectedBook._id, state.rating);
      toast.success("Rating posted", { duration: 4000 });
      closeRateModal();
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
      closeRateModal();
    }
  };

  return (
    <>
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="loans-container">
        <h2 className="loans-title">My loans</h2>
        {state.noLoans && <p>No loans associated with your account</p>}
        <div className="cards-container">
          {state.loans.length > 0 ? (
            state.loans.map((loan) => (
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
                        dispatch({
                          type: "SET_SELECTED_BOOK",
                          payload: loan.book_ID,
                        });
                        openRateModal();
                      }}
                    >
                      Rate
                    </button>
                    <button
                      className="btn btn-comment"
                      onClick={() => {
                        dispatch({
                          type: "SET_SELECTED_BOOK",
                          payload: loan.book_ID,
                        });
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
            <p className="no-loans-text">
              No loans associated with your account
            </p>
          )}
        </div>
      </div>
      <Modal isOpen={isRateModalOpen} onClose={closeRateModal}>
        {state.selectedBook && (
          <RateModal
            book={state.selectedBook}
            rating={state.rating}
            onRatingChange={(e) =>
              dispatch({ type: "SET_RATING", payload: e.target.value })
            }
            onSubmit={handleRateSubmit}
          />
        )}
      </Modal>
      <Modal isOpen={isCommentModalOpen} onClose={closeCommentModal}>
        {state.selectedBook && (
          <CommentModal
            book={state.selectedBook}
            commentText={state.commentText}
            onCommentChange={(e) =>
              dispatch({ type: "SET_COMMENT_TEXT", payload: e.target.value })
            }
            onSubmit={handleCommentSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default Loans;
