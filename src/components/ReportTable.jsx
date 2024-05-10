/* eslint-disable react/prop-types */
import { Space } from "antd";
import { IoIosRefresh } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <IoIosRefresh />
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
// const ReportTable = () => <Table columns={columns} dataSource={data} />;

export default function ReportTable({ title }) {
  return (
    <div>
      <div className="flex items-center justify-between my-1">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="flex items-center justify-between gap-2 bg-grey-200 px-3 py-2 rounded-full border">
          <input
            type="text"
            placeholder="search"
            className="border-none bg-transparent focus:outline-none text-gray-600"
          />
          <span className="w-3 h-3 font-bold">
            <CiSearch />
          </span>
        </div>
      </div>
      <div className="w-full border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-slate-800">
            <tr className="divide-x divide-gray-200">
              <th className="px-4 py-2">Heading</th>
              <th className="px-4 py-2">Heading</th>
              <th className="px-4 py-2">Heading</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-slate-800">
            <tr className="divide-x divide-gray-200">
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">
                <IoIosRefresh />
              </td>
            </tr>
            <tr className="divide-x divide-gray-200">
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">
                <IoIosRefresh />
              </td>
            </tr>
            <tr className="divide-x divide-gray-200">
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">Row</td>
              <td className="px-4 py-2">
                <IoIosRefresh />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
