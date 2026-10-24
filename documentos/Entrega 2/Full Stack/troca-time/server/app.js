import express from "express";
import eventosRoutes from "./routes/eventosRoutes.js";
import fornecedoresRoutes from "./routes/fornecedoresRoutes.js";

const app = express();

app.use(express.json());

app.use("/eventos", eventosRoutes);
app.use("/fornecedores", fornecedoresRoutes);

export default app;
