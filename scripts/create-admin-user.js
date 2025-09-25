const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    try {
        const connection = await pool.getConnection();
        
        console.log('🔄 Admin kullanıcısı oluşturuluyor...');
        
        // Önce users tablosunun var olup olmadığını kontrol et
        const [tables] = await connection.execute(`
            SHOW TABLES LIKE 'users'
        `);
        
        if (tables.length === 0) {
            console.log('📋 Users tablosu bulunamadı, oluşturuluyor...');
            
            await connection.execute(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'editor', 'user') DEFAULT 'user',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            
            console.log('✅ Users tablosu oluşturuldu!');
        }
        
        // Admin kullanıcısının var olup olmadığını kontrol et
        const [existingUsers] = await connection.execute(`
            SELECT * FROM users WHERE username = 'admin' OR email = 'admin@hudosk.com'
        `);
        
        if (existingUsers.length > 0) {
            console.log('ℹ️ Admin kullanıcısı zaten mevcut!');
            console.log('📧 Email: admin@hudosk.com');
            console.log('🔑 Şifre: admin123');
            connection.release();
            return;
        }
        
        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Admin kullanıcısını oluştur
        await connection.execute(`
            INSERT INTO users (username, email, password, role) 
            VALUES (?, ?, ?, ?)
        `, ['admin', 'admin@hudosk.com', hashedPassword, 'admin']);
        
        console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
        console.log('📧 Email: admin@hudosk.com');
        console.log('🔑 Şifre: admin123');
        console.log('🔐 Role: admin');
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        process.exit(0);
    }
}

// Scripti çalıştır
createAdminUser(); 
