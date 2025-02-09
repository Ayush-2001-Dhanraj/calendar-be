import { UnauthorizedError } from "../errors/index.js";

const getUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
  }
  return next(new UnauthorizedError("Unauthorized!"));
};
const deleteUser = (req, res) => {};
const updateEmail = (req, res) => {};

export { getUser, deleteUser, updateEmail };
