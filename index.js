const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');  
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');
const { Server } = require('socket.io');
const UidDb = require('./repository/uidDb');
const UID = require('./model/uid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const portWeb = 3000;
const db = new UidDb();

app.use(express.json());
app.use('/css', express.static(path.join(__dirname, 'css')));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/cadastrar', (req, res) => res.sendFile(path.join(__dirname, 'views', 'cadastrar.html')));
app.get('/consultar', (req, res) => res.sendFile(path.join(__dirname, 'views', 'consultar.html')));

app.get("/consultar-uid", (req, res) => {
    const uid = req.query.uid;
    db.consultar(uid, (err, resultado) => {
        if(err) return res.status(500).json({ status:"erro", mensagem: err.message });
        if(resultado) res.json({ status:"sucesso", resultado });
        else res.status(404).json({ status:"erro", resultado: null });
    });
});

app.post("/cadastrar", (req, res) => {
    const { uid, nome } = req.body;  
    const objUid = new UID(uid, nome);
    db.cadastrar(objUid, (err) => {
        if(err) return res.status(500).send("Erro no servidor");
        res.send(`UID cadastrado: ${JSON.stringify(objUid)}`);
    });
});

// Conexão WebSocket
io.on('connection', (socket) => {
    console.log('Navegador conectado via WebSocket');
});

const serialPort = new SerialPort({
  path: 'COM10', // substitua pela sua porta
  baudRate: 115200
});
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (uid) => {
    uid = uid.trim().toUpperCase();
    console.log('UID lido do ESP32:', uid);

    db.consultar(uid, (err, resultado) => {
        if(err) return console.log(err);

        // envia para todos os navegadores conectados
        io.emit('uid-lido', { uid, existe: !!resultado });
    });
});

server.listen(portWeb, () => console.log(`Servidor rodando na porta ${portWeb}`));
