import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FaBell, FaSearch } from "react-icons/fa";
import {
  IoFilterOutline,
  IoLogOut,
  IoPersonAdd,
  IoShareSocial,
} from "react-icons/io5";
import { CiSettings } from "react-icons/ci";

import user from "../assets/user.jpg";

export default function HeaderNav() {
  return (
    <div className="flex items-center justify-between gap-6 my-3">
      <div className="flex items-center bg-white w-full space-x-4">
        <div className="flex items-center justify-between  w-full border rounded-md p-2">
          <div className="flex items-center gap-3 w-full ">
            <FaSearch className="text-gray-400" />
            <input
              className="w-1/2 focus:outline-none"
              placeholder="Search by name"
              type="search"
            />
          </div>

          <div className="bg-white border flex items-center px-2 py-1 rounded-md text-sm">
            <span>Filter</span>
            <IoFilterOutline className="h-4 w-6 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <IoShareSocial className="h-8 w-8 text-blue-300 rounded-full bg-white p-1 shadow-md hidden md:block" />
        <FaBell className="h-8 w-8 text-yellow-400 rounded-full bg-white p-1 shadow-md" />
        <DropDownMenu />
      </div>
    </div>
  );
}

export function DropDownMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleLogout = () => {
    handleClose();
    navigate("/login");
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={user} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IoPersonAdd fontSize="larger" />
          </ListItemIcon>
          Profile
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <Avatar fontSize="larger" /> My account
        </MenuItem> */}

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CiSettings fontSize="larger" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IoLogOut fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
