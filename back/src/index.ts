import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { simulate } from "./simulation/simulation.js";

const app = express();
const PORT = 3000;

// 👇 ESTO ES LO QUE FALTABA
app.use(express.json());
app.use(cors());

app.post("/simulate", (req: Request, res: Response) => {
  const { arrivalTimes, serviceTimes, steps } = req.body;

  const result = simulate(
    { arrivalTimes, serviceTimes },
    steps
  );

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});