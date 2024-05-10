import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Button from "../ui/Button";
import house from "../assets/house.jpg";

export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 flex-col-reverse md:grid-cols-2 ">
      <Welcome />
      <div className="max-w-md w-full">
        <div className="lg:flex-1 flex flex-col justify-center items-start bg-white p-8">
          <img
            alt="Logo"
            className="mb-8"
            height="120"
            src={logo}
            style={{
              aspectRatio: "200/100",
            }}
            width="200"
          />
          <div className="flex items-start flex-col">
            <h2 className="text-2xl font-bold mb-2">Hello Again!</h2>
            <p className="text-lg mb-8">Welcome Back</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div
      className="lg:flex-1 bg-cover bg-center"
      style={{
        backgroundImage: { house }.url,
      }}
    >
      <div className="bg-black bg-opacity-50 flex flex-col justify-center items-start p-8 h-full">
        <h1 className="text-white text-4xl font-bold mb-4">
          Powell Home Inspection
        </h1>
        <p className="text-white text-lg mb-6">
          The most popular peer to peer inspection at your doorstep
        </p>
        <Button type="primary" className="">
          Read More
        </Button>
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/home");
  };
  return (
    <div className="w-full ">
      <form className="space-y-4 flex flex-col">
        <input className="input" placeholder="Email Address" type="email" />
        <input className="input" placeholder="Password" type="password" />
        <div className="flex flex-col items-stretch justify-center gap-2 w-full ">
          <Button
            type="primary"
            className="w-full bg-blue-500 text-white"
            onClick={handleLogin}
          >
            Login
          </Button>
          <p className="flex justify-center">or</p>
          <Button
            type="secondary"
            className="w-full bg-blue-500 text-white"
            to={"/register"}
          >
            Sign up
          </Button>
        </div>
      </form>
      <Link className="text-blue-500 py-3 flex justify-center">
        Forgot password
      </Link>
    </div>
  );
}
