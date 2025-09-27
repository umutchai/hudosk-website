const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const email = 'ucumutcay@gmail.com';
const username = email;
const plainPassword = 'ikisogukbiramvarabi6';
const role = 'admin';

(async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Admin user creation started...');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await connection.execute(`
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password = VALUES(password),
        role = VALUES(role);
    `, [username, email, hashedPassword, role]);

    console.log('Admin user ready:');
    console.log(`  Email   : ${email}`);
    console.log(`  Username: ${username}`);
    console.log(`  Role    : ${role}`);

    // Activities tablosuna cover_photo kolonu ekle (eksikse)
    const [coverPhotoCol] = await connection.execute(`
      SHOW COLUMNS FROM activities LIKE 'cover_photo'
    `);

    if (coverPhotoCol.length === 0) {
      await connection.execute(`
        ALTER TABLE activities 
        ADD COLUMN cover_photo VARCHAR(500) NULL AFTER title
      `);
      console.log('✅ Activities tablosuna cover_photo kolonu eklendi');
    }

  } catch (err) {
    console.error('Failed to create admin user:', err.message);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
})();

