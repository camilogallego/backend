const authMdw = (req, res, next) => {
  if (req.user) {
    return next();
  }

  return res.redirect("/login");
};

export default authMdw;
