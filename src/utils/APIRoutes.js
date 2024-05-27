//const host = "http://localhost:3000";
const host = "https://proyecto-13-back.vercel.app";

export const getUser = `${host}/api/users`;
export const getBooks = `${host}/api/books/`;
export const getBookById = (bookId) => `${host}/api/books/${bookId}`;
export const getReviewsByBookId = (bookId) =>
  `${host}/api/reviews/book/${bookId}`;
export const getCommentsByBookId = (bookId) =>
  `${host}/api/comments/book/${bookId}`;

export const createLoan = (bookId) => `${host}/api/loans/${bookId}`;
export const getUserLoans = `${host}/api/loans/user`;
export const deleteLoan = (loanId) => `${host}/api/loans/${loanId}`;
export const createComment = (bookId) => `${host}/api/comments/${bookId}`;
export const createRating = (bookId) => `${host}/api/reviews/${bookId}`;

export const getRatings = `${host}/api/reviews/reviews`;
export const getComments = `${host}/api/comments/comments`;
export const deleteRatingOrComment = (type, id) => `${host}/api/${type}/${id}`;

// auth
export const login = `${host}/api/auth/login`;
export const register = `${host}/api/auth/register`;
