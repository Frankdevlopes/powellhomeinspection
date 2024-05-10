import Button from "../ui/Button";

import logo from "../assets/logo.png";
import WelcomeArea from "../components/WelcomeArea";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen grid grid-cols-1 flex-col-reverse md:grid-cols-2 ">
      <WelcomeArea />
      <div className="bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-12">
            <img
              alt="Logo"
              className="mb-8"
              height="100"
              src={logo}
              style={{
                aspectRatio: "200/100",
              }}
              width="200"
            />
          </div>
          <div className="space-y-6  w-full">
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-semibold text-center">Hello!</h2>
              <p className="text-center text-sm">Sign Up to Get Started</p>
            </div>
            <div className="space-y-4">
              <SignupForm />
              <p className="text-sm">
                Already have an account?{" "}
                <Link to={"/login"} className="underline text-blue-400">
                  Log in{" "}
                </Link>
                here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupForm() {
  return (
    <form className="space-y-4 flex flex-col">
      <input className="input" placeholder="Full Name" type="text" />
      <input className="input" placeholder="Email Address" type="email" />
      <input className="input" placeholder="Password" type="password" />
      <Button type="primary" className="w-full bg-blue-500 text-white">
        Register
      </Button>
    </form>
  );
}
