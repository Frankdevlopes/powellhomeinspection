import { Card } from "@mui/material";
import { LineChart } from "@mui/x-charts";

export default function InspectionTotal() {
  return (
    <Card className="w-full">
      <>
        <h2>Total Inspections</h2>
      </>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={400}
        height={300}
      />
    </Card>
  );
}
