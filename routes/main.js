import express from "express";
const router = express.Router();

import { login, register, loginFailed } from "../controller/auth.js";
import { deleteUser, getUser, updateEmail } from "../controller/user.js";
import {
  createEvent,
  getEvent,
  getAllUserEvents,
  deleteEvent,
  updateEvent,
} from "../controller/event.js";
import passport from "passport";

router
  .route("/auth/login")
  .get(loginFailed)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/api/v1/auth/login",
    }),
    login
  );
router.route("/auth/register").post(register);

router
  .route("/user/:userID")
  .get(getUser)
  .patch(updateEmail)
  .delete(deleteUser)
  .post(createEvent);

router.route("/user/:userID/events").get(getAllUserEvents);

router
  .route("/event/:eventID")
  .get(getEvent)
  .delete(deleteEvent)
  .patch(updateEvent);

export default router;
