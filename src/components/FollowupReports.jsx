/* eslint-disable react/prop-types */
import { useState } from "react";

const data = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
  { id: 3, name: "Alice Smith", email: "alice.smith@example.com" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

const FollowupReports = () => {
  const [filters, setFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  //   const handleFilterChange = (column, event) => {
  //     setFilters({
  //       ...filters,
  //       [column]: event.target.value,
  //     });
  //   };

  const handleSortChange = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredData = data.filter((item) => {
    for (const key in filters) {
      if (
        filters[key] &&
        item[key]
          .toString()
          .toLowerCase()
          .indexOf(filters[key].toLowerCase()) === -1
      ) {
        return false;
      }
    }
    return true;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortColumn && sortDirection === "asc") {
      return a[sortColumn].toString().localeCompare(b[sortColumn].toString());
    }
    if (sortColumn && sortDirection === "desc") {
      return b[sortColumn].toString().localeCompare(a[sortColumn].toString());
    }
    return 0;
  });

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 border-b-2 border-gray-200 cursor-pointer"
              onClick={() => handleSortChange(column.key)}
            >
              {column.label}
              {sortColumn === column.key && <span className="ml-2">▲ ▼</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td
                key={column.key}
                className="px-6 py-4 border-b border-gray-200"
              >
                {item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FollowupReports;
