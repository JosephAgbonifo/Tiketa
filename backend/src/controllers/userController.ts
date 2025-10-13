import platformAPIClient from "../services/platformAPIClient";
import { Request, Response, NextFunction } from "express";
import { User } from "../models";

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.body.authResult;

  try {
    const me = await platformAPIClient.get("/v2/me", {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    console.log(me.data);
  } catch (err) {
    return next(err);
  }

  let currentUser = await User.findOne({ uid: auth.user.uid }).exec();

  if (currentUser) {
    currentUser = await User.findByIdAndUpdate(
      currentUser._id,
      { accessToken: auth.accessToken },
      { new: true }
    ).exec();
  } else {
    currentUser = await User.create({
      username: auth.user.username,
      uid: auth.user.uid,
      roles: auth.user.roles,
      accessToken: auth.accessToken,
    });
  }

  req.session.currentUser = currentUser;

  if (!currentUser) {
    return res.status(500).json({ message: "Failed to sign in user." });
  }

  return res
    .cookie("morphtoken", currentUser.accessToken, {
      httpOnly: false, // JS can't read it (protects against XSS)
      secure: false, //process.env.NODE_ENV === "production", // only send over HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1 days
    })
    .status(200)
    .json({
      message: "User signed in",
      user: currentUser,
    });
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.currentUser = null;
  return res.status(200).json({ message: "User signed out" });
};
