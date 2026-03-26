import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

type Row = {
  clock: number;
  nextArrival: number | string;
  nextDeparture: number | string;
  PS: number;
  Q: number;
};

export default function SimulationTable({ data }: { data: Row[] }) {
  return (
    <Paper sx={{ marginTop: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell align="center">Hora actual</TableCell>
            <TableCell align="center">Próx llegada</TableCell>
            <TableCell align="center">Fin servicio</TableCell>
            <TableCell align="center">Cola</TableCell>
            <TableCell align="center">PS</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell align="center">{row.clock}</TableCell>
              <TableCell align="center">{row.nextArrival}</TableCell>
              <TableCell align="center">{row.nextDeparture}</TableCell>
              <TableCell align="center">{row.Q}</TableCell>
              <TableCell align="center">
                {row.PS === 1 ? "Ocupado" : "Libre"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}