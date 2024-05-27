import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import "./index.css";

const App = lazy(() => import("./App.jsx"));
const BooksPage = lazy(() => import("./pages/BooksPage.jsx"));
const BookPage = lazy(() => import("./pages/BookPage.jsx"));
const LoansPage = lazy(() => import("./pages/LoansPage.jsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.jsx"));
const SignInPage = lazy(() => import("./pages/SignInPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <App />
              </Suspense>
            }
          />
          <Route
            path="/books"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <BooksPage />
              </Suspense>
            }
          />
          <Route
            path="/books/:bookId"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <BookPage />
              </Suspense>
            }
          />
          <Route
            path="/myloans"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <LoansPage />
              </Suspense>
            }
          />
          <Route
            path="/myreviews"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <ReviewsPage />
              </Suspense>
            }
          />
          <Route
            path="/signin"
            element={
              <Suspense fallback={<h2>Cargando datos...</h2>}>
                <SignInPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
