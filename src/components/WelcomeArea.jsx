import Button from "../ui/Button";

export default function WelcomeArea() {
  return (
    // <div className="bg-[url('../assets/house.jpg?height=600&width=787')]  bg-center flex items-center justify-center p-8">
    <div className="bg-gray-400 bg-center flex items-center justify-center p-8">
      <div className="text-white max-w-md">
        <h1 className="text-4xl font-bold mb-4">Powell Home Inspection</h1>
        <p className="mb-6">
          The most popular peer to peer inspection at your doorstep
        </p>
        <Button type="primary" className="bg-white text-gray-800">
          Read More
        </Button>
      </div>
    </div>
  );
}
