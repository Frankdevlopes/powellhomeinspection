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

// Import necessary Firebase modules
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";

// Firebase configuration object (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyAZHfHbdRILuAqhbv7pjAJNNMJzZWI4hhc",
  authDomain: "powellinspection.firebaseapp.com",
  projectId: "powellinspection",
  storageBucket: "powellinspection.appspot.com",
  messagingSenderId: "868353797491",
  appId: "1:868353797491:web:31e4ceba87288439b1e906",
  measurementId: "G-VVDGKDRPDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export default function HeaderNav() {
  return (
    <div className="flex items-center justify-between gap-6 my-3">
      <div className="flex items-center bg-white w-full space-x-4">
        {/* Search bar */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Other icons */}
        <DropDownMenu />
      </div>
    </div>
  );
}

export function DropDownMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(auth.currentUser?.photoURL || '');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleLogout = () => {
    handleClose();
    navigate("/login");
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const user = auth.currentUser;
    if (user) {
      const storageRef = ref(storage, `profile_images/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: imageUrl });
      setProfilePic(imageUrl); // Update the local state
    }
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
            <Avatar sx={{ width: 32, height: 32 }} src={profilePic} />
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
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <IoPersonAdd fontSize="larger" />
          </ListItemIcon>
          Profile
        </MenuItem>
       
        {/* Other menu items */}
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
