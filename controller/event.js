import sql from "../db/sql.js";
import { UnauthorizedError } from "../errors/index.js";

const createEvent = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { userID } = req.params;
    const user = await sql("SELECT * FROM users WHERE id =$1", [userID]);
    if (user.length) {
      const { title, description, eventDate, eventTime } = req.body;
      const newEvent = await sql(
        "INSERT INTO events (user_id, title, description, event_date, event_time) VALUES ($1, $2, $3, $4, $5) RETURNING *, event_date::TEXT AS event_date",
        [userID, title, description, eventDate, eventTime]
      );
      if (newEvent.length) {
        return res.json({ event: newEvent[0] });
      } else {
        return res.json({ msg: "Event creation failed!" });
      }
    } else {
      return res.json({ msg: `Can't find the user with id ${userID}` });
    }
  }
  return next(new UnauthorizedError("Unauthorized!"));
};
const getAllUserEvents = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { userID } = req.params;
    const user = await sql("SELECT * FROM users WHERE id =$1", [userID]);
    if (user.length) {
      const allEvents = await sql(
        "SELECT *, event_date::TEXT AS event_date FROM events WHERE user_id = $1",
        [userID]
      );

      return res.json({ events: allEvents });
    } else {
      return res.json({ msg: `Can't find the user with id ${userID}` });
    }
  }
  return next(new UnauthorizedError("Unauthorized!"));
};
const getEvent = (req, res) => {};
const deleteEvent = (req, res) => {};
const updateEvent = (req, res) => {};

export { createEvent, getEvent, getAllUserEvents, deleteEvent, updateEvent };
