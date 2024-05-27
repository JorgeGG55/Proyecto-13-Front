import { getRatings, getComments, deleteRatingOrComment } from "./APIRoutes";

const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `${token}`,
    },
  });

  if (response.status === 404) {
    return [];
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error fetching data");
  }

  return data;
};

export const fetchReviews = () => fetchWithToken(getRatings);
export const fetchComments = () => fetchWithToken(getComments);
export const deleteItem = (type, id) =>
  fetchWithToken(deleteRatingOrComment(type, id), { method: "DELETE" });
