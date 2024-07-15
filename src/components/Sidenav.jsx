import { Link } from "react-router-dom";
import { FaChartBar, FaCheck, FaFile, FaHome, FaUser } from "react-icons/fa";
import { GrTemplate } from "react-icons/gr";
import { MdOutlineSupportAgent } from "react-icons/md";
import { SiBaremetrics } from "react-icons/si";
import { CiSettings } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import logo from "../assets/logo.png";
import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CiMenuBurger } from "react-icons/ci";
import { Box } from "@mui/material";

export default function SideNav() {
  return (
    <aside className="p-4 space-y-4 flex flex-col justify-between">
      <ul className="space-y-2">
        <div className="flex items-center justify-center ">
          <img alt="logo" className="h-16 w-16" src={logo} />
        </div>
        <Link to="/home" className="flex items-center space-x-2">
          <FaHome className="h-3 w-3 text-gray-600" />
          <span>Home</span>
        </Link>
        <Link to="/pdf" className="flex items-center space-x-2">
          <FaFile className="h-3 w-3 text-gray-600" />
          <span>PDF Overlay</span>
        </Link>
       
        <Link to="/report-dashboard" className="flex items-center space-x-2">
          <FaChartBar className="h-3 w-3 text-gray-600" />
          <span>Reports Dashboard</span>
        </Link>
        <Link to="/template-builder" className="flex items-center space-x-2"> {/* Update this link */}
          <GrTemplate className="h-3 w-3 text-gray-600" />
          <span>Templates</span>
        </Link>
      </ul>
     
    </aside>
  );
}

export function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <SideNav />
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <CiMenuBurger />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
