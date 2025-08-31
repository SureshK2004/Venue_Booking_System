import jwt from "jsonwebtoken"

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ message: "Unauthorized" })
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ message: "Forbidden" })
    next()
  }
}
