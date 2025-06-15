import jwt from "jsonwebtoken";

// Generate a JWT token
export const generateToken = (userId, res) => {
  // Generate token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Attach token to header
  res.header("Authorization", `Bearer ${token}`);

  // Attach token to cookie
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks

  });

  return token;
};