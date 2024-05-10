import { Checkbox } from "@mui/material";

export default function KpiReport() {
  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-lg font-semibold">KPIs Report</h2>
      <ul className="mt-2 space-y-2">
        <li className="flex items-center">
          <Checkbox id="report1" />
          <label className="ml-2" htmlFor="report1">
            Inspections to report
          </label>
        </li>
        <li className="flex items-center">
          <Checkbox id="report2" />
          <label className="ml-2" htmlFor="report2">
            Analytics insights complete
          </label>
        </li>
        <li className="flex items-center">
          <Checkbox id="report3" />
          <label className="ml-2" htmlFor="report3">
            Inspections analytics
          </label>
        </li>
        <li className="flex items-center">
          <Checkbox id="report4" />
          <label className="ml-2" htmlFor="report4">
            Projected revenues last 3 years
          </label>
        </li>
        <li className="flex items-center">
          <Checkbox id="report5" />
          <label className="ml-2" htmlFor="report5">
            Market event impact graph
          </label>
        </li>
      </ul>
    </div>
  );
}
