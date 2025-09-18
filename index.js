const express = require('express')
const app = express()
const path = require('path')
const UidDb = require('./repository/uidDb')
const UID = require('./model/uid')
const port = 3000
const db = new UidDb()

app.use(express.json())

app.use('/css', express.static(path.join(__dirname, 'css')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/cadastrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastrar.html'));
});

app.get('/consultar', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'consultar.html'));
})

app.get("/consultar-uid", (req, res) => {
    const uid = req.query.uid
    db.consultar(uid, (err, resultado) => {
        if(err) {
            console.log("Erro:", err);
            res.status(500).send("Erro no servidor");
        } else if(resultado) {
            console.log("UID encontrado:", resultado);
            res.json({ status: "sucesso", resultado });
        } else {
            console.log("UID não encontrado");
            res.redirect('/cadastrar')
        }
    })
})

app.post("/cadastrar", (req, res) => {
    const { uid, nome } = req.body;  
    const objUid = new UID(uid, nome);

    db.cadastrar(objUid, (err) => {
        if(err) {
            console.log("Erro:", err);
            return res.status(500).send("Erro no servidor");
        } 
        console.log("UID cadastrado:", objUid);
        res.send(`UID cadastrado: ${JSON.stringify(objUid)}`);
    });
});

app.listen(port, () => console.log(`Aplicação aberta na porta ${port}`))