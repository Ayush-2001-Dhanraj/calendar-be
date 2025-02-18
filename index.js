import express from "express";
import sql from "./db/sql.js";
import appRoutes from "./routes/main.js";
import NotFoundMiddleWare from "./middleware/not-found.js";
import ErrorHandlerMiddleware from "./middleware/error-handler.js";
import { Strategy } from "passport-local";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import cors from "cors";
import pg from "pg";
import pgSession from "connect-pg-simple";

const app = express();

const PORT = process.env.PORT || 3001;

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in .env
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new (pgSession(session))({
      pool: pgPool, // Connect to your Neon PostgreSQL DB
      tableName: "session", // Default is 'session'
      createTableIfMissing: true, // Optional: Auto-creates the table
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: true, // Secure in production
      httpOnly: true,
      sameSite: "none",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.get("/", async (_, res) => {
  res.json({
    msg: "Welcome to Calendar Project Backend (from: Ayush Dhanraj)",
  });
});
app.use("/api/v1", appRoutes);

app.use(NotFoundMiddleWare);
app.use(ErrorHandlerMiddleware);

passport.use(
  "local",
  new Strategy(
    { usernameField: "email" }, // ✅ Tell Passport to use "email" instead of "username"
    async function verify(email, password, cb) {
      try {
        const retrievedUser = await sql(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (!retrievedUser.length) {
          return cb(null, false, { message: "User doesn't exist" });
        }

        const { password: storedPassword, ...userDetails } = retrievedUser[0];

        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (passwordMatch) {
          return cb(null, userDetails);
        } else {
          return cb(null, false, { message: "Incorrect password" });
        }
      } catch (e) {
        return cb(e);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
