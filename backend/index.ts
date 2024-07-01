import express from "express";
import bodyParser from "body-parser";
import router from "./routes/user";
import cors from "cors";



const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/user', router);


app.listen(8000,()=>{
    console.log("server running on port 8000");
});