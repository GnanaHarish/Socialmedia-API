const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

const app = express();
mongoose.set('strictQuery', true);
dotenv.config();
const port = process.env.PORT;

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true }, () => {
    console.log("Connected to MongoDB");
})


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(port || 6000, () => {
    console.log("Backend server is running at port " + port);
})