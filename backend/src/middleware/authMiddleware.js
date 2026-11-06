
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || "studytrack_token";
    const token = req.cookies?.[cookieName];

    if (!token) {
      throw new ApiError(401, "Authentication required. Please log in.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User account no longer exists.");
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new ApiError(401, "Invalid or expired authentication token."));
    }

    next(error);
  }
};

export { protect };
export default protect;
