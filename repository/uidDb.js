const sqlite = require('sqlite3').verbose()

class UidDb{
    constructor(){
        this.db = new sqlite.Database('./uid.db', (err)=>{
            if(err) 
                console.log(`Erro ao abrir o banco: ${err.message}`)
            else
                console.log('Banco conectado com sucesso!')
        })

        this.db.run(`CREATE TABLE IF NOT EXISTS uid(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT,
            nome TEXT          
            )`)
    }

    cadastrar(objUid, callback){
        this.db.run(`INSERT INTO uid (uid, nome) VALUES (?,?)`,
            [objUid.uid, objUid.nome],
            (err)=>{ if(callback) callback(err)})
    }

    consultar(uid, callback){
        this.db.all(
            `SELECT * FROM uid WHERE uid = ?`,
            [uid],
            (err, rows) => {
                if(err) {
                    if(callback) callback(err, null);
                    return;
                }
                const encontrado = rows.length > 0;
                if(callback) callback(null, encontrado ? rows : null);
            }
        )
    }


}

module.exports = UidDb