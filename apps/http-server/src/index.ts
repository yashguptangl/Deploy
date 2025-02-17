import express from "express"
import { userRouter } from "./routes/user.auth";
import { ownerRouter } from "./routes/owner";
import { listingRouter } from "./routes/listing";
import { ownerDashboard } from "./routes/owner.dashboard";
import cors from 'cors';
import "./cronJob";
import userDashboard from "./routes/user.dashboard";


const app = express();
app.use(express.json());
app.options('*', cors()); // Handle preflight requests for all routes


// Use CORS middleware
app.use(cors({
    origin : 'http://staging-fe.roomlocus.com:3000',
    methods : ['GET','POST','PUT','DELETE'],
}));


app.use("/api/v1/user",userRouter);
app.use("/api/v1/owner",ownerRouter);
app.use("/api/v1/listing",listingRouter);
app.use("/api/v1/owner",ownerDashboard);
app.use("/api/v1/user", userDashboard);


app.listen(3001,() =>{
    console.log("server started");
});
