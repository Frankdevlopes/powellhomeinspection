import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent,
  Avatar,
} from "@mui/material";
import user from "../assets/user.jpg";

export default function HomeDashboard() {
  return (
    <main className="lg:col-span-3 md:flex">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full">
            <TableComponent />
          </div>
          <TableComponent />
        </div>
        <div className="bg-white p-4 rounded-md shadow mt-4">
          <h2 className="text-lg font-semibold">Today&apos;s Inspections</h2>
          <div className="mt-2">
            <img
              alt="Map with pins"
              className="w-full h-48 object-cover rounded-md"
              src="/placeholder.svg"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">Total Inspections</h2>
            <div className="mt-2">
              {/* <CurvedlineChart className="w-full h-[200px]" /> */}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">Top Clients</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Number of Inspections</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Lisa Smith</TableCell>
                  <TableCell>25</TableCell>
                  <TableCell>01/01/2023</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Brown</TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>01/02/2023</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">Contact User Application</h2>
            <div className="mt-2">
              {/* <BarChart className="w-full h-[200px]" /> */}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">Overall User Activity</h2>
            <div className="mt-2">
              {/* <CurvedlineChart className="w-full h-[200px]" /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/5">
        <TodoList />
        <Notifications />
      </div>
    </main>
  );
}

function Notifications() {
  return (
    <div className="bg-white rounded-lg space-y-4">
      <div className="flex justify-between border-b p-4">
        <h3 className="font-bold">Notifications</h3>
        <p>See all</p>
      </div>

      <ul>
        <li className="flex gap-3">
          <Avatar src={user} />
          <div className="space-y-2">
            <h4 className="font-medium">John Smith</h4>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Unde
              excepturi a mollitia dolorem quo recusandae eum.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

function TodoList() {
  return (
    <div className="bg-white rounded-md h-max my-6 divide-y-2">
      <h3 className="font-bold p-4 ">Todo list</h3>
      <div className="">
        <p className="p-1 text-sm border-b text-blue-300 flex items-center justify-end">
          <span>0</span>/ <span>10</span> completed
        </p>
        <ul className="*:p-3 space-y-2 divide-y text-gray-500">
          <li>Receipt to inspection list</li>
          <li>Receipt to inspection list</li>
          <li>Receipt to inspection list</li>
          <li>Receipt to inspection list</li>
        </ul>
      </div>
    </div>
  );
}
function TableComponent() {
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
