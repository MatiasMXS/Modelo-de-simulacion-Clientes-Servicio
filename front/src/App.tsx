import { useEffect, useState } from "react";
import SimulationTable from "./components/SimulationTable";
import {
  Button,
  Container,
  Typography,
  TextField,
  Stack,
} from "@mui/material";

type Row = {
  clock: number;
  nextArrival: number | string;
  nextDeparture: number | string;
  PS: number;
  Q: number;
};

function App() {
  const [data, setData] = useState<Row[]>([]);
  const [arrivalInput, setArrivalInput] = useState("45,45,45,45");
  const [serviceInput, setServiceInput] = useState("40,40,40,40");

  const parseInput = (input: string) =>
    input.split(",").map((n) => Number(n.trim()));

  const fetchSimulation = async () => {
    try {
      const res = await fetch("http://localhost:3000/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          arrivalTimes: parseInput(arrivalInput),
          serviceTimes: parseInput(serviceInput),
          steps: 10,
        }),
      });

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error al simular:", error);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2 }}>
        Simulación de Clientes
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Tiempos de llegada (ej: 45,45,45)"
          fullWidth
          value={arrivalInput}
          onChange={(e) => setArrivalInput(e.target.value)}
        />

        <TextField
          label="Tiempos de servicio (ej: 40,40,40)"
          fullWidth
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
        />

        <Button variant="contained" onClick={fetchSimulation}>
          Simular
        </Button>
      </Stack>

      <SimulationTable data={data} />
    </Container>
  );
}

export default App;