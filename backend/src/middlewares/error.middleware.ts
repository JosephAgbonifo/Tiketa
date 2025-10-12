import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  name: string;
  value?: any;
  errors?: Record<string, { message: string }>;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error: CustomError = { ...err };
    error.message = err.message || "Internal Server Error";
    console.error(error);

    // Mongoose error handling
    if (err.name === "ValidationError" && err.errors) {
      error.statusCode = 400;
      error.message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    } else if (err.name === "CastError") {
      error.statusCode = 400;
      error.message = `Resource not found with id of ${err.value}`;
    } else if (err.code === 11000 && err.keyValue) {
      error.statusCode = 400;
      error.message = `Duplicate field value entered: ${Object.keys(
        err.keyValue
      ).join(", ")}`;
    } else {
      error.statusCode = err.statusCode || 500;
    }

    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Server Error",
      stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
  } catch (innerError) {
    next(innerError);
  }
};

export default errorMiddleware;
