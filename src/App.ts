import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { connect } from 'mongoose';
import router from './routes/itemRoutes.js';
import dbConnect from './config/db.js';
const app = express();

app.use(express.json());

let reqCnt = 0;
app.use((req: Request, res: Response, next: NextFunction)=>{
    reqCnt++;
    console.log("Requests hit to server", reqCnt);
    next();
})

app.use("/api/items", router);

app.get("/", (req:Request, res:Response) => {
    res.status(200).send({
        msg:"Welcome to Exobrain!!"
    })
});    

const PORT = process.env.PORT || 5000;
app.listen(PORT, async ()=>{
    console.log("Server listening on port:", PORT);
    console.log(`Click: http://localhost:${PORT}`);

    await dbConnect();
});