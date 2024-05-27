import {
  getUserLoans,
  deleteLoan,
  createComment,
  createRating,
} from "./APIRoutes";

const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error fetching data");

  return data;
};

export const fetchUserLoans = () => fetchWithToken(getUserLoans);
export const finishLoan = (loanId) =>
  fetchWithToken(deleteLoan(loanId), { method: "DELETE" });
export const postComment = (bookId, content) =>
  fetchWithToken(createComment(bookId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
export const postRating = (bookId, rating) =>
  fetchWithToken(createRating(bookId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: String(rating) }),
  });
