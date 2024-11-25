const express = require("express");
const app = express();
const database = require("./db/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
app.use(express.json());
dotenv.config();

database.connect();

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
const userRoutes = require("./routes/User");

//routes
app.use("/api/v1/auth", userRoutes);


app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`App is running at ${PORT}`);
});
