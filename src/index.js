
import express from "express"; 
import morgan from "morgan";
import cors from "cors";
import joyasRouter from "./routes/joyas.routes.js";

const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(cors());
app.use(joyasRouter);

app.listen(
  3000,
  console.log("Server listening on port 3000 -  url: http://localhost:3000")
);