import sql from "../db/sql.js";
import { BadRequestError, UnauthorizedError } from "../errors/index.js";
import bcrypt from "bcrypt";

const loginFailed = (req, res, next) => {
  return next(new BadRequestError("Failure"));
};
const login = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({ msg: "Success", user: req.user });
  } else {
    return next(new UnauthorizedError("Unauthorized!!"));
  }
};

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const response = await sql(`SELECT * FROM users WHERE email = $1`, [email]);
  if (response.length) {
    return next(new BadRequestError("User Already Exists"));
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("Bcrypt hashing error", err);
    } else {
      const result = await sql(
        `INSERT INTO users (first_name, last_name, email, password) vALUES ($1, $2, $3, $4) RETURNING *`,
        [firstName, lastName, email, hash]
      );
      const user = result[0];
      req.logIn(user, (err) => {
        console.log(err);
        res.redirect(`/api/v1/user/${user.id}`);
      });
    }
  });
};

export { login, register, loginFailed };
