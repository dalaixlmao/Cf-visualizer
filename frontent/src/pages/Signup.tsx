import { useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Signup() {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onClick() {
    const response = await axios.post("http://localhost:8000/user/signup", {
      username: email,
      handle: handle,
      password: password,
    });
    if (response.data.token) localStorage.setItem("token", "Brearer "+response.data.token);

    console.log(response.data);
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-row w-full h-full justify-between absolute z-1">
        <div className="bg-yellow-300 w-1/4"></div>
        <div className="bg-blue-300 w-1/4"></div>
        <div className="bg-red-300 w-1/4"></div>
      </div>
      <Card
        text={"Signup"}
        subHeading={
          "Enter your codeforces handle, email and password to access further."
        }
        items={[
          { type: "handle", setFunction: setHandle },
          { type: "email", setFunction: setEmail },
          { type: "password", setFunction: setPassword },
        ]}
        buttonWidth="full"
        belowButton={["Already signed up?", "Login"]}
        navigateTo={"/signin"}
        onClick={onClick}
      />
    </div>
  );
}
