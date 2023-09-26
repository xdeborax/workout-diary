export default async (req, res, next) => {
  const { isAdmin } = req.headers.loggedInUserData;
  if (isAdmin) {
    next();
  } else {
    const error = new Error('Admin permission is needed');
    error.status = 401;
    next(error);
  }
};
