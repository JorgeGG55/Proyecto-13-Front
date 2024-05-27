import React from "react";
import { NavLink } from "react-router-dom";

const ReviewTable = ({
  title,
  items,
  message,
  onDelete,
  onPageChange,
  currentPage,
  itemsPerPage,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="table-container">
      <h2>{title}</h2>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="title-row">Book Image</th>
              <th className="title-row">Book Title</th>
              <th className="title-row">
                {title === "Ratings" ? "Rating" : "Comment"}
              </th>
              <th className="title-row">Remove</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <NavLink
                    className="navLink"
                    to={`/books/${item.book_ID._id}`}
                  >
                    <img
                      src={item.book_ID.bookImg}
                      alt={item.book_ID.title}
                      height="100px"
                    />
                  </NavLink>
                </td>
                <td>{item.book_ID.title}</td>
                <td>
                  {title === "Ratings" ? (
                    item.rating
                  ) : (
                    <p className="comment-text"> ' {item.content} '</p>
                  )}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(item._id)}
                  >
                    <img
                      className="button-img"
                      src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2017/png/iconmonstr-trash-can-27.png&r=244&g=67&b=54"
                      alt=""
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="message">{message}</p>
      )}
      {items.length > itemsPerPage && (
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(items.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`pagination-button ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => onPageChange(i + 1)}
                disabled={currentPage === i + 1}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
