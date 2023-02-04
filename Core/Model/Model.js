const Database = require('../../Core/Database/Database');
class Model {
    static getOne(tableName, condition = []){
        let db = new Database();
        db = db.getDatabase();
        let query = `SELECT * FROM ${tableName}`;
        if(condition.length > 0){
            query += ' WHERE ';
            condition.forEach((c, index) => {
                query += `${c}`;
                if(index < condition.length - 1){
                    query += ' AND ';
                }
            });
        }
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if(err){
                    reject(err);
                    db.close();
                }
                resolve(row);
                db.close();
            });
        });
    }
    static getAll(tableName, condition = [], args = []){
        let db = new Database();
        db = db.getDatabase();
        let query = `SELECT * FROM ${tableName}`;
        if(condition.length > 0){
            query += ' WHERE ';
            condition.forEach((c, index) => {
                query += `${c}`;
                if(index < condition.length - 1){
                    query += ' AND ';
                }
            });
        }
        args.forEach(arg => {
            query += ` ${arg}`;
        });
        return new Promise((resolve, reject) => {
            db.all(query, (err, row) => {
                if(err){
                    reject(err);
                    db.close();
                }
                resolve(row);
                db.close();
            });
        });
    }
    static insert(tableName, dataObject, condition = []){
        let db = new Database();
        db = db.getDatabase();
        let query = `INSERT INTO ${tableName}(`;
        let fields = Object.keys(dataObject);
        let data = Object.values(dataObject);
        fields.forEach(field => {
            query += `${field},`;
        });
        query = query.slice(0, -1);
        query += ') VALUES (';
        data.forEach(d => {
            query += `'${d}',`;
        });
        query = query.slice(0, -1);
        query += ')';
        if(condition.length > 0){
            query += ' WHERE ';
            condition.forEach((c, index) => {
                query += `${c}`;
                if(index < condition.length - 1){
                    query += ' AND ';
                }
            });
        }
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if(err){
                    reject(err);
                    db.close();
                }
                resolve(true);
                db.close();
            });
        });
    }
    static update(tableName, dataObject, condition = []){
        let db = new Database();
        db = db.getDatabase();
        let query = `UPDATE ${tableName} SET `;
        let fields = Object.keys(dataObject);
        let data = Object.values(dataObject);
        fields.forEach((field, index) => {
            query += `${field} = '${data[index]}',`;
        });
        query = query.slice(0, -1);
        query += ' ';
        if(condition.length > 0){
            query += ' WHERE ';
            condition.forEach((c, index) => {
                query += `${c}`;
                if(index < condition.length - 1){
                    query += ' AND ';
                }
            });
        }
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if(err){
                    reject(err);
                    db.close();
                }
                resolve(true);
                db.close();
            });
        });
    }
    static delete(tableName, condition = []){
        let db = new Database();
        db = db.getDatabase();
        let query = `DELETE FROM ${tableName}`;
        if(condition.length > 0){
            query += ' WHERE ';
            condition.forEach((c, index) => {
                query += `${c}`;
                if(index < condition.length - 1){
                    query += ' AND ';
                }
            });
        }
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if(err){
                    reject(err);
                    db.close();
                }
                resolve(true);
                db.close();
            });
        });
    }
}
module.exports = Model;