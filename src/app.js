

// Initial Express configuration
require('dotenv').config();
const cors = require('cors');
const helmet = require("helmet");
const express =require( "express");
const {cHandler, auth, apiError} = require("./middleware");
const {apis} = require("./bot/api");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.options("*", cors);

// Entry point used for health checks or other purposes
app.get("/", (_req, res, next) => {
    res.status(200).json({ success: true });
    next();
});

// cHandler(app);
app.use(auth);
apis(app);
app.use(apiError);

// Users module router
// app.use("/users", userRouter);

// Start server listening
app.listen(process.env.PORT, "0.0.0.0", ()=> {
    console.log("Server running on port", process.env.PORT);
});


