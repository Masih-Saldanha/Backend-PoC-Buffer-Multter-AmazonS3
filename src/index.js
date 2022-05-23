import express, { json } from "express";
import cors from "cors";
import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

import db from "./db.js"
dotenv.config();

const app = express();

app.use(json());
app.use(cors());

// FORMA SEM CONFIGURAÇÕES DE ARMAZENAMENTO:
// const upload = multer({ dest: 'uploads/' });

// CONFIGURAÇÃO DE ARMAZENAMENTO NA API
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         // Extração da extensão do arquivo original:
//         const extensaoArquivo = file.originalname.split('.')[1];
//         const nomeOriginalDoArquivo = file.originalname.split('.')[0];

//         // Indica o novo nome do arquivo:
//         cb(null, `${nomeOriginalDoArquivo}-${Date.now()}.${extensaoArquivo}`)
//     }
// });

// const upload = multer({ storage });

// CONFIGURAÇÃO DE ARMAZENAMENTO NA AWS
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const extensaoArquivo = file.originalname.split('.')[1];
            const nomeOriginalDoArquivo = file.originalname.split('.')[0];

            cb(null, `${nomeOriginalDoArquivo}-${Date.now()}.${extensaoArquivo}`)
        }
    })
})

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

// REQUISIÇÃO DE ENVIO LISTA DE USUÁRIOS:
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