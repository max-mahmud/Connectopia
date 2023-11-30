import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import dbConnection from "./dbConfig/index.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8800;
dbConnection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
