import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { connect } from 'mongoose';
import dbConnect from './config/db';
const app = express();

let reqCnt = 0;
app.use((req: Request, res: Response, next: NextFunction)=>{
    reqCnt++;
    console.log("Requests hit to server", reqCnt);
    next();
})

app.get("/", (req: Request, res: Response)=>{
    res.status(200).send({msg: "Server Running"});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, async ()=>{
    console.log("Server listening on port:", PORT);
    console.log(`Click: http://localhost:${PORT}`);

    await dbConnect();
});