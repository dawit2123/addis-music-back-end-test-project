import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import musicRoutes from "./routes/musicRoutes.js";
import { connectDB } from "./config/database.js";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

dotenv.config({ path: "config.env" });

//connect to the db
connectDB();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const app = express();

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//serving static files
app.use(express.static(__dirname + "/public"));

// setting the home directory
app.use((req, res, next) => {
  req.homedir = __dirname;
  next();
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/music", musicRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running at port ${process.env.PORT || 5000}`);
});
