const express = require('express')
const app = express()
const path = require('path')
const UidDb = require('./repository/uidDb')
const UID = require('./model/uid')
const port = 3000
const db = new UidDb()

app.get("/", (req, res)=> res.send('RFID Scanner'))

app.get("/consultar", (req, res) => {
    db.consultar("123", (err, resultado) => {
        if(err) {
            console.log("Erro:", err);
            res.status(500).send("Erro no servidor");
        } else if(resultado) {
            console.log("UID encontrado:", resultado);
            res.send(`UID encontrado: ${JSON.stringify(resultado)}`);
        } else {
            console.log("UID não encontrado");
            res.redirect('/cadastrar')
        }
    });
});

app.get("/cadastrar", (req, res) => {
    const objUid = new UID('123', 'Pedro');

    db.cadastrar(objUid, (err) => {
        if(err) {
            console.log("Erro:", err);
            res.status(500).send("Erro no servidor");
        } else {
            console.log("UID cadastrado:", objUid);
            res.send(`UID cadastrado: ${JSON.stringify(objUid)}`);
        }
    });
});



app.listen(port, () => console.log(`Aplicação aberta na porta ${port}`))