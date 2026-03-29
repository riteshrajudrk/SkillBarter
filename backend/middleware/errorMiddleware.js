const isDatabaseError = (message = "") => {
  const text = String(message).toLowerCase();

  return (
    text.includes("buffering timed out") ||
    text.includes("ecconnrefused") ||
    text.includes("mongodb") ||
    text.includes("mongoose")
  );
};

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const errorMessage = error.message || "Server error";

  if (statusCode >= 500) {
    console.error("Server error:", errorMessage);
  }

  let message = errorMessage;

  if (statusCode >= 500) {
    message = isDatabaseError(errorMessage)
      ? "We could not connect right now. Please try again in a moment."
      : "Something went wrong. Please try again.";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
