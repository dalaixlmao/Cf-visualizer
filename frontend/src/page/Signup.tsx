import Card from "../components/Card";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../components/ErrorComponent";

export default function Signup() {
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [handle, setHandle]= useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    async function onClick(){
      setLoading(true);
      console.log(email, password, handle);
        console.log("clicked")
        try{const response = await axios.post("https://ec2-65-2-78-117.ap-south-1.compute.amazonaws.com:8000/user/signup", {
          email:email,
          password:password,
          handle:handle
        });
        console.log(response.data)
        if (response.data.message == "Signed up successfully") {
            localStorage.setItem("token", "Bearer "+ response.data.token);
            navigate("/dashboard");
          }
          setLoading(false);}catch(e){
            setError(true)
            setLoading(false);
            setTimeout(()=>{
              setError(false)
            },3000)
          }
    }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-cfbg bg-no-repeat bg-cover bg-center">
      <div className="absolute top-14">
        {error ? <ErrorComponent /> : <></>}
      </div>
      <Card width="auto rounded-xl">
        <Heading title={"Sign Up"} subHeading="Don't have an account?"/>
        <InputBox setFunction={setHandle} type="text" label="Password" placeholder="Enter your handle..."/>
        <InputBox setFunction={setEmail} type="text" label="Email" placeholder="Enter your email..."/>
        <InputBox setFunction={setPassword} type="password" label="Password" placeholder="Enter your password..."/>
        <Button title={"Sign Up"} onClick={onClick} loading={loading}/>
      </Card>
    </div>
  );
}
