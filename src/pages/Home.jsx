import HeaderNav from "../components/Headernav";
import HomeDashboard from "./HomeDashboard";
import SideNav from "../components/Sidenav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:flex md:flex-row md:gap-4">
      <SideNav />
      <div className="grid grid-cols-1 md:flex md:flex-col gap-4 md:w-full">
        <HeaderNav />
        <HomeDashboard />
      </div>
    </div>
  );
}
