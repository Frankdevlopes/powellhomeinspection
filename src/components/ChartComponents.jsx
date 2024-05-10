import { BarchartCompt } from "./Barchart";
import LinechartCompt from "./LineChart";

export default function ChartComponents() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 gap-3 w-full  grid-rows-1 my-3">
      <div className="col-start-1 col-end-4  bg-white flex justify-center items-center py-3 px-2  rounded-lg shadow ">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Users</h2>
          <p className="text-xl font-bold mb-3">4,209</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">62% New</p>
              <p className="text-sm text-gray-500">38% Returning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-start-4 col-end-8 ">
        <div className="bg-white py-3 px-2  rounded-lg shadow col-span-2">
          {/* <BarChart className="w-full h-[300px]" /> */}
          <BarchartCompt
            title="Overall User Satisfaction"
            width="300"
            height="200"
          />
          <div className="flex justify-between items-center mt-3"></div>
        </div>
      </div>

      <div className="col-start-8 col-end-12 bg-white py-3 px-2  rounded-lg shadow col-span-2">
        <div className="flex justify-between items-center mt-3">
          <h2 className="text-xl font-semibold">Overall User Activity</h2>
        </div>
        <LinechartCompt width="350" height="200" />
      </div>
    </div>
  );
}
