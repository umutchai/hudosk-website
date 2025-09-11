const mysql = require('mysql2/promise');

// Veritabanı konfigürasyonu
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'timsah67.',
    database: process.env.DB_NAME || 'Huddosk',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
};

// Connection pool oluştur
const pool = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10
});

async function addCoverPhotoColumn() {
    try {
        const connection = await pool.getConnection();
        
        // Cover photo sütununu ekle
        await connection.execute(`
            ALTER TABLE activities 
            ADD COLUMN cover_photo VARCHAR(500) COMMENT 'Faaliyet kapak fotoğrafı' 
            AFTER title
        `);
        
        console.log('✅ Cover photo sütunu başarıyla eklendi!');
        
        // Mevcut kayıtları kontrol et
        const [rows] = await connection.execute('SELECT id, title, cover_photo FROM activities LIMIT 5');
        console.log('📊 Mevcut kayıtlar:');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, Title: ${row.title}, Cover Photo: ${row.cover_photo || 'Yok'}`);
        });
        
        connection.release();
        
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ Cover photo sütunu zaten mevcut.');
        } else {
            console.error('❌ Sütun ekleme hatası:', error.message);
        }
    } finally {
        await pool.end();
    }
}

addCoverPhotoColumn();




