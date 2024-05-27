import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewTable from "../ReviewTable/ReviewTable";
import {
  fetchReviews,
  fetchComments,
  deleteItem,
} from "../../utils/APIReviews";
import { useAuth } from "../../hooks/useAuth";
import { Toaster, toast } from "sonner";
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
          ratings: ratingsData.length ? ratingsData : [],
          ratingsMessage: ratingsData.length
            ? ""
            : "No hay ratings disponibles.",
          comments: commentsData.length ? commentsData : [],
          commentsMessage: commentsData.length
            ? ""
            : "No hay comentarios disponibles.",
          ratingsPage: 1,
          commentsPage: 1,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData((prevData) => ({
          ...prevData,
          ratingsMessage: "Error al cargar ratings.",
          commentsMessage: "Error al cargar comentarios.",
        }));
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDelete = async (type, id) => {
    try {
      const response = await deleteItem(type, id);
      const message = response.message || "Eliminado exitosamente.";

      setData((prevData) => {
        const newData = {
          ...prevData,
          [type === "reviews" ? "ratings" : "comments"]: prevData[
            type === "reviews" ? "ratings" : "comments"
          ].filter((item) => item._id !== id),
        };

        if (newData.ratings.length === 0 || newData.comments.length === 0) {
          window.location.reload();
        }

        return newData;
      });

      toast.success(message);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(
        `Error al eliminar ${type === "reviews" ? "rating" : "comentario"}.`
      );
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
    <>
      <Toaster position="bottom-right" expand={true} richColors />
      <div className="review-container">
        <ReviewTable
          title="Ratings"
          items={ratings}
          message={ratingsMessage}
          onDelete={(id) => handleDelete("reviews", id)}
          onPageChange={(page) => handlePageChange("ratingsPage", page)}
          currentPage={ratingsPage}
          itemsPerPage={itemsPerPage}
        />
        <ReviewTable
          title="Comments"
          items={comments}
          message={commentsMessage}
          onDelete={(id) => handleDelete("comments", id)}
          onPageChange={(page) => handlePageChange("commentsPage", page)}
          currentPage={commentsPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </>
  );
};

export default Reviews;
