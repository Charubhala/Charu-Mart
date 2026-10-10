const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./charumart.db', (err) => {
    if (err) {
        console.error('Could not connect to database:', err.message);
        return;
    }
    
    db.run(`UPDATE users SET role = 'admin' WHERE email = 'bhalacharu@gmail.com'`, function(err) {
        if (err) {
            console.error('Error updating role:', err.message);
        } else {
            console.log('Success! User role updated to admin in charumart.db.');
        }
        db.close();
    });
});