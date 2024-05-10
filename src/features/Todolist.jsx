export default function TodoList() {
  return (
    <div className="w-full bg-white">
      <h2 className="p-3 font-bold border-b">To-Do List</h2>

      <>
        <div className="h-[15rem] overflow-y-scroll ">
          <p className="text-sm text-blue-400 px-3 py-1 border-b flex items-center justify-end">
            <span>0</span> / <span>10</span> completed
          </p>
          <ul className="w-full *:border-b *:p-2">
            <li>Receipt to inspection list</li>
            <li>Receipt to inspection list</li>
            <li className="">Receipt to inspection list</li>
            <li className="">Receipt to inspection list</li>
            <li className="">Receipt to inspection list</li>
          </ul>
        </div>
      </>
    </div>
  );
}
