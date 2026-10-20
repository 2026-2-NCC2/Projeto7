import express from "express";
import eventosRoutes from "./routes/eventosRoutes.js";

const app = express();

app.use(express.json());

app.use("/eventos", eventosRoutes);

export default app;