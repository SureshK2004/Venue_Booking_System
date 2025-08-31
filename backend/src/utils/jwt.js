import jwt from "jsonwebtoken";

export function signAccessToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "default_access_secret",
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    }
  );
}

export function signRefreshToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET || "default_access_secret"
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret"
  );
}
