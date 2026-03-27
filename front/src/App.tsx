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
const timeToSeconds = (time: string): number => {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

function App() {
  const [data, setData] = useState<Row[]>([]);
  const [arrivalInput, setArrivalInput] = useState("45");
  const [serviceInput, setServiceInput] = useState("40");
  const [initialQueue, setInitialQueue] = useState("3");
  const [startTime, setStartTime] = useState("08:00:00");
  const [firstArrival, setFirstArrival] = useState("08:05:00");
  const [firstDeparture, setFirstDeparture] = useState("08:03:00");
  const [endTime, setEndTime] = useState("08:20:00");


  const parseInput = (input: string) => [Number(input)];

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

          startTime: timeToSeconds(startTime),
          firstArrival: timeToSeconds(firstArrival),
          firstDeparture: timeToSeconds(firstDeparture),
          initialQueue: Number(initialQueue),
          endTime: timeToSeconds(endTime),
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
  
  {/* Tiempos base */}
  <Stack direction="row" spacing={2}>
    <TextField
      label="Llegadas (seg)"
      value={arrivalInput}
      onChange={(e) => setArrivalInput(e.target.value)}
      size="small"
    />

    <TextField
      label="Servicio (seg)"
      value={serviceInput}
      onChange={(e) => setServiceInput(e.target.value)}
      size="small"
    />
  </Stack>

  {/* Horas */}
  <Stack direction="row" spacing={2}>
    <TextField
      label="Inicio"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      size="small"
    />

    <TextField
      label="1° Llegada"
      value={firstArrival}
      onChange={(e) => setFirstArrival(e.target.value)}
      size="small"
    />

    <TextField
      label="1° Fin"
      value={firstDeparture}
      onChange={(e) => setFirstDeparture(e.target.value)}
      size="small"
    />
  </Stack>

  {/* Otros */}
  <Stack direction="row" spacing={2}>
    <TextField
      label="Cola inicial"
      value={initialQueue}
      onChange={(e) => setInitialQueue(e.target.value)}
      size="small"
    />

    <TextField
      label="Fin simulación"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      size="small"
    />
  </Stack>

  <Button variant="contained" onClick={fetchSimulation}>
    Simular
  </Button>
</Stack>

      <SimulationTable data={data} />
    </Container>
  );
}

export default App;