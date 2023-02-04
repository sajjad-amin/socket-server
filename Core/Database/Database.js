class Database {
    constructor(){
        const sqlite = require('sqlite3').verbose();
        const path = require('path');
        const dbPath = path.resolve(__dirname, '../../App/Database/Database.db');
        this.connection = new sqlite.Database(dbPath, (err) => {
            if(err){
                console.log(err);
            }
        });
    }
    getDatabase(){
        return this.connection;
    }
    closeDatabase(){
        this.connection.close();
    }
}
module.exports = Database;