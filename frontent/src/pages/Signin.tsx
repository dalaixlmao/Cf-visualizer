import { useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onClick(){
    const response = await axios.post("http://localhost:8000/user/signin",{
        username:email,
        password:password
    });
    if(response.data.token)
    localStorage.setItem("token", "Brearer "+response.data.token);

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
        text={"Signin"}
        subHeading={
          "Enter your valid email and password to access dashboard."
        }
        items={[
          { type: "email", setFunction: setEmail },
          { type: "password", setFunction: setPassword },
        ]}
        buttonWidth="full"
        belowButton={["Create an account?", "Signup"]}
        navigateTo={"/signup"}
        onClick={onClick}
      />
    </div>
  );
}
