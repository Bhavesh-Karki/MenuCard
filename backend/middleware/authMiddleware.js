function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'] || req.query.userId || req.body.user_id;

  if (!userId) {
    return res.status(401).json({ message: 'User id is required.' });
  }

  req.userId = String(userId);
  return next();
}

module.exports = { requireUser };
