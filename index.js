const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");

const bodyParser = require('body-parser');
const session = require('express-session');

const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRouter = require("./routes/AdminRouter");
dbConnect();

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/admin", AdminRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
