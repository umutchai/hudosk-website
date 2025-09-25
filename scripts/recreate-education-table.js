const { pool } = require('../config/database');

async function recreateEducationTable() {
    try {
        console.log('🔄 Education_programs tablosu yeniden oluşturuluyor...');
        
        const connection = await pool.getConnection();
        
        // Mevcut tabloyu sil
        await connection.execute('DROP TABLE IF EXISTS education_programs');
        console.log('🗑️ Eski tablo silindi');
        
        // Yeni tabloyu oluştur
        await connection.execute(`
            CREATE TABLE education_programs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
                duration VARCHAR(100),
                location VARCHAR(255),
                max_participants INT DEFAULT 0,
                current_participants INT DEFAULT 0,
                instructor VARCHAR(255),
                price DECIMAL(10,2) DEFAULT 0.00,
                start_date DATE,
                end_date DATE,
                topics JSON,
                prerequisites JSON,
                images JSON,
                status ENUM('active', 'inactive', 'draft', 'completed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Yeni education_programs tablosu oluşturuldu');
        connection.release();
        
        console.log('🎯 Tablo yeniden oluşturma işlemi tamamlandı!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Tablo yeniden oluşturma hatası:', error);
        process.exit(1);
    }
}

recreateEducationTable(); 
