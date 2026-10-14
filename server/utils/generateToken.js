import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";

// Signs a JWT for the given customer and sends it back as an HttpOnly cookie
const generateToken = (res, customerId) => {
  const token = jwt.sign({ id: customerId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateToken;
export { COOKIE_NAME };
