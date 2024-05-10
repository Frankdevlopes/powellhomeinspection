import { UserApplication } from "../features/UserApplication";
import InspectionsLocation from "../features/InspectionLocations";
import TopClients from "../features/TopClients";
import TableComponent from "../components/TableComponent";
import InspectionTotal from "../features/InspectionTotal";
import TodoList from "../features/Todolist";
import Notifications from "../features/Notifications";
import KpiReport from "../features/KpiReport";
import UserActivity from "../features/UserActivity";

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 ">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TableComponent />
            <TableComponent />
          </div>
          <div>
            <InspectionsLocation />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <InspectionTotal />

            <TopClients />
          </div>
        </div>

        <div className="lg:col-span-4">
          <TodoList />

          <Notifications />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <KpiReport />

        <UserApplication />

        <UserActivity />
      </div>
    </div>
  );
}
