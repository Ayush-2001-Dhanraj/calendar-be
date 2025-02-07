const PORT = 3000;

import express from "express";
import sql from "./db/sql.js";
import appRoutes from "./routes/main.js";
import NotFoundMiddleWare from "./middleware/not-found.js";
import ErrorHandlerMiddleware from "./middleware/error-handler.js";

const app = express();

// Middlewares

app.use(express.json());
app.use("/api/v1", appRoutes);
app.get("/", async (_, res) => {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.use(NotFoundMiddleWare);
// app.use(ErrorHandlerMiddleware);

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
