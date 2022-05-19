import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js"
dotenv.config();

const app = express();

app.use(json());
app.use(cors());

app.get("/produtos", async (req, res) => {
    try {
        const produtos = await db.collection("produtos").find().toArray();
        res.send(produtos);
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
});

app.post("/produtos", async (req, res) => {
    try {
        await db.collection("produtos").insertOne(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Ouvindo na porta 5000!");
});