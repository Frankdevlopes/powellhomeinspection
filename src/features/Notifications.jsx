import { Avatar, Card } from "@mui/material";
import user from "../assets/user.jpg";

export default function Notifications() {
  return (
    <Card className="w-full mt-6">
      <div className="flex items-center justify-between p-3  border-b">
        <h2>Notifications</h2>
        <p>See all</p>
      </div>

      <div className="h-48 overflow-y-scroll">
        <ul className="w-full *:border-b *:p-2">
          <li className="flex gap-3 items-start">
            <Avatar src={user} />
            <div className="flex flex-col">
              <h3 className="font-medium">John Doe</h3>
              <p className="font-light text-gray-400 line-clamp-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
                deserunt ad rem illum ratione. Consequatur dolore in iusto,
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
}
