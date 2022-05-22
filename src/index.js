import express, { json, urlencoded } from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

import db from "./db.js"
dotenv.config();

const app = express();

app.use(json());
app.use(cors());

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];
        const nomeOriginalDoArquivo = file.originalname.split('.')[0];

        // Indica o novo nome do arquivo:
        cb(null, `${nomeOriginalDoArquivo}-${Date.now()}.${extensaoArquivo}`)
    }
});

const upload = multer({ storage });

// FORMA SEM CONFIGURAÇÕES DE ARMAZENAMENTO:
// const upload = multer({ dest: 'uploads/' });

// REQUISIÇÃO COM APENAS UM ARQUIVO E JSON:

app.post("/usuarios", upload.single("foto"), async (req, res) => {
    const { nome, idade } = req.body;
    try {
        await db.collection("usuarios").insertOne({ nome, idade: parseInt(idade) });
        // console.log(req.body);
        // console.log(req.file);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

// REQUISIÇÃO COM VÁRIOS ARQUIVOS E JSON:

app.post("/usuarios/maisfotos", upload.array("foto"), async (req, res) => {
    const { nome, idade } = req.body;
    try {
        await db.collection("usuarios").insertOne({ nome, idade: parseInt(idade) });
        // console.log(req.body);
        // console.log(req.files);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get("/usuarios", async (req, res) => {
    try {
        const produtos = await db.collection("usuarios").find().toArray();
        res.status(200).send(produtos);
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Ouvindo na porta 5000!");
});