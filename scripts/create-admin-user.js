const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ucumutcay@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ikisogukbiramvarabi6';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || ADMIN_EMAIL;
const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin';

(async function createAdminUser() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Admin kullanýcýsý oluþturma iþlemi baþladý...');

        await connection.execute(
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'editor', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        );

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        await connection.execute(
            INSERT INTO users (username, email, password, role)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                password = VALUES(password),
                role = VALUES(role)
        , [ADMIN_USERNAME, ADMIN_EMAIL, hashedPassword, ADMIN_ROLE]);

        console.log('Admin kullanýcýsý hazýr:');
        console.log(  Email   : );
        console.log(  Username: );
        console.log(  Role    : );
    } catch (error) {
        console.error('Hata:', error.message);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
})();
