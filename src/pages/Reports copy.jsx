import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import { BarchartCompt } from "../components/Barchart";
import LinechartCompt from "../components/LineChart";

export default function Reports() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* HEADER */}
        <div className="flex flex-col justify-between md:flex-row md:items-center gap-5  sticky w-full  top-0 bg-gray-50 z-10">
          <h1 className="text-2xl font-semibold text-gray-900">My Reports</h1>
          <div className="items-center bg-gray-300 px-2 py-3 rounded-md flex">
            <div className="flex items-center justify-between md:justify-normal md:grid gap-4  lg:grid-cols-4">
              <NavLink
                className="justify-center bg-white px-1 py-2 rounded-md"
                variant="outline"
              >
                Overview
              </NavLink>
              <NavLink className="justify-center" variant="outline">
                Assigned
              </NavLink>
              <NavLink className="justify-center" variant="outline">
                In progress
              </NavLink>
              <NavLink className="justify-center" variant="outline">
                Past
              </NavLink>
            </div>
          </div>
        </div>

        <Options />
        <Component />
      </div>
    </div>
  );
}

function Options() {
  const [timeframe, setTimeframe] = useState("");

  const handleChange = (event) => {
    setTimeframe(event.target.value);
  };
  return (
    <div className="flex items-center gap-5 p-6">
      {/* Timeframe */}
      <div className="bg-white shadow-md w-max flex items-center rounded-lg">
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 120, borderRadius: 120 }}
        >
          <InputLabel id="demo-simple-select-standard-label">
            Time Frame
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={timeframe}
            onChange={handleChange}
            label="Time frame"
          >
            <MenuItem value={"All-time"}>All-time</MenuItem>
            <MenuItem value={"This Year"}>This Year</MenuItem>
            <MenuItem value={"This month"}>This month</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* CLIENT */}
      <div className="bg-white shadow-md w-max flex items-center rounded-lg">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Client</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={timeframe}
            onChange={handleChange}
            label="Time frame"
          >
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Client"}>Client 2</MenuItem>
            <MenuItem value={"Client"}>Client 3</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Workspace */}
      <div className="bg-white shadow-md w-max flex items-center rounded-lg">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Workscape
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={timeframe}
            onChange={handleChange}
            label="Time frame"
          >
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"workspace"}>Workspace 2</MenuItem>
            <MenuItem value={"workspace 2"}>Workscape 3</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white p-6 rounded-lg shadow ">
          <h2 className="text-2xl font-semibold mb-2">Users</h2>
          <p className="text-xl font-bold mb-3">4,209</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">62% New</p>
              <p className="text-sm text-gray-500">38% Returning</p>
            </div>
          </div>
        </div>

        {/* USER SATISFACTION */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
          {/* <BarChart className="w-full h-[300px]" /> */}
          <BarchartCompt
            title="Overall User Satisfaction"
            width="300"
            height="200"
          />
          <div className="flex justify-between items-center mt-3">
            {/* <h2 className="text-xl font-semibold">Overall User Satisfaction</h2> */}
            {/* <Select>
              <SelectTrigger id="user-satisfaction">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>

        {/* USER ACTIVIRY */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
          <div className="flex justify-between items-center mt-3">
            <h2 className="text-xl font-semibold">Overall User Activity</h2>
            {/* <Select>
              <SelectTrigger id="user-activity">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <LinechartCompt width="350" height="200" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow md:col-start-1 md:col-end-2 ">
          <h2 className="text-2xl font-semibold mb-2">Subscriptions</h2>
          <p className="text-xl font-bold mb-3">1,302</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">40% Paid</p>
              <p className="text-sm text-gray-500">60% Trial</p>
            </div>
            <div className="w-16 h-16">
              {/* <PieChart className="w-full h-full" /> */}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-4 ">
          {/* <BarChart className="w-full h-[300px]" /> */}
          <div className="flex justify-between items-center mt-3 ">
            <h2 className="text-xl font-semibold">Overall User Acquisition</h2>
            {/* <Select>
              <SelectTrigger id="user-acquisition">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <LinechartCompt width="500" height="350" />
        </div>
      </div>
    </div>
  );
}
