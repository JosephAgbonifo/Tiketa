import { Request, Response, NextFunction } from "express";
import platformAPIClient from "../services/platformAPIClient";

// Extend Express Request type to include user (username only)
declare global {
  namespace Express {
    interface Request {
      user?: string;
      image?: string;
    }
  }
}

/**
 * Middleware: Verify a user using a Bearer token.
 * Token can come from Authorization header or cookie.
 */
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.morphtoken;
    const token =
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : cookieToken) || null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // 2. Validate token via Pi Platform API
    const response = await platformAPIClient.get("/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 3. Attach verified user to request
    req.user = response.data.username;

    next();
  } catch (err: any) {
    console.error(
      "🔒 User verification failed:",
      err.response?.data || err.message
    );
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};
