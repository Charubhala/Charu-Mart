const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const files = fs.readdirSync('.').filter(f => f.endsWith('.sqlite') || f.endsWith('.db') || f.endsWith('.sqlite3'));
console.log("Scanning database files in project:", files);

files.forEach(file => {
    const db = new sqlite3.Database(file, sqlite3.OPEN_READONLY, (err) => {
        if (err) return;
        db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
            if (!err && tables.length > 0) {
                console.log(`\n✅ FOUND IT! File '${file}' contains these tables:`, tables.map(t => t.name));
            }
            db.close();
        });
    });
});