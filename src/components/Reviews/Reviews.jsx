import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewTable from "../ReviewTable/ReviewTable";
import {
  fetchReviews,
  fetchComments,
  deleteItem,
} from "../../utils/APIReviews";
import { useAuth } from "../../hooks/useAuth";
import "./Reviews.css";

const Reviews = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState({
    ratings: [],
    ratingsMessage: "",
    comments: [],
    commentsMessage: "",
    ratingsPage: 1,
    commentsPage: 1,
  });
  const itemsPerPage = 4;

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [ratingsData, commentsData] = await Promise.all([
          fetchReviews(),
          fetchComments(),
        ]);

        setData({
          ratings: ratingsData || [],
          ratingsMessage: ratingsData.length
            ? ""
            : "No hay ratings disponibles.",
          comments: commentsData || [],
          commentsMessage: commentsData.length
            ? ""
            : "No hay comentarios disponibles.",
          ratingsPage: 1,
          commentsPage: 1,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchReviews, fetchComments, navigate]);

  const handleDelete = async (type, id) => {
    try {
      await deleteItem(type, id);
      setData((prevData) => ({
        ...prevData,
        [type === "rating" ? "ratings" : "comments"]: prevData[
          type === "rating" ? "ratings" : "comments"
        ].filter((item) => item._id !== id),
      }));
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handlePageChange = (type, page) => {
    setData((prevData) => ({
      ...prevData,
      [type]: page,
    }));
  };

  const {
    ratings,
    ratingsMessage,
    comments,
    commentsMessage,
    ratingsPage,
    commentsPage,
  } = data;

  return (
    <div className="review-container">
      <ReviewTable
        title="Ratings"
        items={ratings}
        message={ratingsMessage}
        onDelete={(id) => handleDelete("rating", id)}
        onPageChange={(page) => handlePageChange("ratingsPage", page)}
        currentPage={ratingsPage}
        itemsPerPage={itemsPerPage}
      />
      <ReviewTable
        title="Comments"
        items={comments}
        message={commentsMessage}
        onDelete={(id) => handleDelete("comment", id)}
        onPageChange={(page) => handlePageChange("commentsPage", page)}
        currentPage={commentsPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default Reviews;
