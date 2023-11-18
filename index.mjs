import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import cars from "./routes/cars.mjs";
import auth from "./routes/auth.mjs"

const PORT = process.env.PORT || 4050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /auth routes
app.use("/auth", auth);

// Load the /cars routes
app.use("/cars", cars);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
