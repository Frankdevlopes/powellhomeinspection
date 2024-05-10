import { Outlet } from "react-router-dom";
import HeaderNav from "../components/Headernav";
import SideNav, { TemporaryDrawer } from "../components/Sidenav";

export default function Applayout() {
  return (
    <div className="flex">
      <div className="h-screen hidden md:block sticky top-0 shadow-r-lg ">
        <SideNav />
      </div>

      <div className="md:hidden w-max">
        <TemporaryDrawer />
      </div>
      <div className="grid grid-cols-1 md:flex md:flex-col gap-4 md:w-full">
        {/* <div> */}
        <HeaderNav />
        <Outlet />
      </div>
    </div>
  );
}
