import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import setUpRoutes from "./routes.js";

// connect to mongoDB atlas
const dbLink = "mongodb+srv://attendams:attendams@attendamsdb.2x0jpcj.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(
    dbLink
);

const db = mongoose.connection;
db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});



// initialize the server
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// setup routes
setUpRoutes(app);

// start server
app.listen(3001, (err) => {
    if (err) { console.log(err); }
    else { console.log("Server listening at port 3001"); }
});

