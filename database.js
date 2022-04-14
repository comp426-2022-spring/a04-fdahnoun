const Database = require('better-sqlite3')

const db = new Database('user.db')

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='userinfo';`)

let row = stmt.get();
if (row === undefined){
    console.log('Log database appears to be empty. Creating log database...')

    const sqlInit = `
        CREATE TABLE userinfo ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr TEXT,
            remoteuser TEXT,
            time TEXT,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            status TEXT, 
            referrer TEXT,
            useragent TEXT
        );
    `
    db.exec(sqlInit)
} else{
    console.log('Log databse exists.')
}

module.exports = db