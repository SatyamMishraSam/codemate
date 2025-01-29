const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const http = require("http");
const app = express();

const cookieParser = require("cookie-parser");
// require("./utils/cronJob");
require("dotenv").config();

// by this CORS we can bypass the CORS error in our frontend API calls
// by passing the parameter inside that we can set the cookies also

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(cookieParser());

// manage all the routes which we transferred from this page
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/paymentRouter");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chatRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

// first database connection then connect it with serverss

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected");
    server.listen(process.env.PORT, () => {
      console.log("Server started at 3000");
    });
  })
  .catch((e) => {
    console.log("Problem in connecting to DB");
  });
