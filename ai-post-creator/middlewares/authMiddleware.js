import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "Token does not exits",
      success: false,
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;
    next()
    
  } catch (error) {
    return res.status(500).json({
      message: "invalid token",
      success: false,
    });
  }
}