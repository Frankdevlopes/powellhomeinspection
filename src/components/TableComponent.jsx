import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
} from "@mui/material";

export default function TableComponent() {
  return (
    <CardContent className="space-y-3">
      <h3 className="font-bold">Late Reports</h3>
      <Table className="bg-white rounded-lg">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Dave Smith</TableCell>
            <TableCell>123 Drive Lane</TableCell>
            <TableCell>01/01/2023</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>456 Drive Lane</TableCell>
            <TableCell>01/02/2023</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  );
}
