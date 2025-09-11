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

// Veritabanı bağlantısını test et
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL veritabanına başarıyla bağlandı!');
        console.log(`📊 Veritabanı: ${dbConfig.database}`);
        console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL veritabanı bağlantı hatası:', error.message);
        return false;
    }
}

// Veritabanı tablolarını oluştur
async function createTables() {
    try {
        const connection = await pool.getConnection();
        
        // Users tablosu (Admin paneli için)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'editor', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Activities tablosu (Yeni format)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL COMMENT 'Faaliyet başlığı (örn: Parmakkaya Klasik Rota Faaliyet Raporu)',
                activity_date DATE NOT NULL COMMENT 'Faaliyet tarihi',
                region VARCHAR(255) COMMENT 'Bölge',
                route VARCHAR(255) COMMENT 'Rota',
                team TEXT COMMENT 'Ekip bilgileri',
                technical_equipment TEXT COMMENT 'Teknik malzeme listesi',
                weather_conditions VARCHAR(255) COMMENT 'Hava durumu',
                report_writer VARCHAR(255) COMMENT 'Raporu yazan kişi',
                
                pre_activity_description TEXT COMMENT 'Faaliyet öncesi açıklama',
                pre_activity_photos JSON COMMENT 'Faaliyet öncesi fotoğraflar',
                
                report_description TEXT COMMENT 'Rapor açıklaması',
                report_photos JSON COMMENT 'Rapor fotoğrafları',
                
                descent_description TEXT COMMENT 'İniş açıklaması',
                descent_photos JSON COMMENT 'İniş fotoğrafları',
                
                opinions TEXT COMMENT 'Görüşler',
                opinion_photos JSON COMMENT 'Görüş fotoğrafları',
                
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Education Programs tablosu
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS education_programs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                difficulty_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
                duration VARCHAR(100),
                location VARCHAR(255),
                instructor VARCHAR(255),
                start_date DATE,
                end_date DATE,
                topics JSON,
                prerequisites JSON,
                curriculum JSON,
                images JSON,
                status ENUM('active', 'inactive', 'draft', 'completed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Team Members tablosu
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS team_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                bio TEXT,
                specialties JSON,
                experience_years INT DEFAULT 0,
                certifications JSON,
                image_url VARCHAR(500),
                social_media JSON,
                status ENUM('active', 'inactive') DEFAULT 'active',
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Site Settings tablosu
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS site_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                setting_type ENUM('text', 'number', 'json', 'boolean') DEFAULT 'text',
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Contact Messages tablosu
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Activity Reports tablosu (Rich Text Editor için)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS activity_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL COMMENT 'Faaliyet raporu başlığı',
                content LONGTEXT COMMENT 'Rich Text Editor ile oluşturulan içerik',
                location VARCHAR(255) COMMENT 'Faaliyet konumu',
                activity_date DATE COMMENT 'Faaliyet tarihi',
                duration VARCHAR(100) COMMENT 'Faaliyet süresi',
                difficulty_level ENUM('Kolay', 'Orta', 'Zor', 'Çok Zor') COMMENT 'Zorluk seviyesi',
                participants_count INT DEFAULT 0 COMMENT 'Katılımcı sayısı',
                weather_conditions VARCHAR(255) COMMENT 'Hava koşulları',
                equipment_used TEXT COMMENT 'Kullanılan ekipman',
                route_description TEXT COMMENT 'Rota açıklaması',
                challenges_faced TEXT COMMENT 'Karşılaşılan zorluklar',
                lessons_learned TEXT COMMENT 'Öğrenilen dersler',
                recommendations TEXT COMMENT 'Öneriler',
                photos JSON COMMENT 'Faaliyet fotoğrafları',
                status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        connection.release();
        console.log('✅ Veritabanı tabloları başarıyla oluşturuldu!');
        
    } catch (error) {
        console.error('❌ Tablo oluşturma hatası:', error.message);
    }
}

module.exports = {
    pool,
    testConnection,
    createTables
}; 