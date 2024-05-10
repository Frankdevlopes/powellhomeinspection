import { Card, CardContent } from "@mui/material";

export default function InspectionsLocation() {
  return (
    <Card className="w-full mt-6">
      <>
        <h2>Today&apos;s Inspections</h2>
      </>
      <CardContent>
        <div className="grid grid-cols-5 gap-4" />
      </CardContent>
    </Card>
  );
}
