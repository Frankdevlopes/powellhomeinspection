import { BarChart, axisClasses } from "@mui/x-charts";

const chartSetting = {
  yAxis: [
    {
      label: "rainfall (mm)",
    },
  ],
  width: 350,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};
const dataset = [
  {
    london: 59,
    month: "Jan",
  },
  {
    london: 50,
    month: "Fev",
  },
  {
    london: 47,
    month: "Mar",
  },
  {
    london: 54,
    month: "Apr",
  },
  {
    london: 57,
    month: "May",
  },
  {
    london: 60,

    month: "June",
  },
  {
    london: 59,
    month: "July",
  },
  {
    london: 65,
    month: "Aug",
  },
  {
    london: 51,

    month: "Sept",
  },
  {
    london: 60,
    month: "Oct",
  },
  {
    london: 67,
    month: "Nov",
  },
  {
    london: 61,
    month: "Dec",
  },
];

const valueFormatter = (value) => `${value}mm`;
export function UserApplication() {
  return (
    <div className="bg-white p-4 rounded-md shadow">
      <h2 className="text-lg font-semibold">Contact User Application</h2>
      <div className="mt-2">
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "month" }]}
          series={[{ dataKey: "london", label: "London", valueFormatter }]}
          {...chartSetting}
        />
      </div>
    </div>
  );
}
