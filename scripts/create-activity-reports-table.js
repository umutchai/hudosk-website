const { pool } = require('../config/database');

async function createActivityReportsTable() {
    try {
        const connection = await pool.getConnection();
        
        console.log('🔄 Activity Reports tablosu oluşturuluyor...');
        
        // Activity Reports tablosu oluştur
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ Activity Reports tablosu başarıyla oluşturuldu!');
        
        // Örnek veri ekle
        console.log('🔄 Örnek faaliyet raporu ekleniyor...');
        
        await connection.execute(`
            INSERT INTO activity_reports (
                title, content, location, activity_date, duration, difficulty_level,
                participants_count, weather_conditions, equipment_used, route_description,
                challenges_faced, lessons_learned, recommendations, photos
            ) VALUES (
                'Parmakkaya Klasik Rota Faaliyet Raporu',
                '<h2>Faaliyet Özeti</h2><p>Bu faaliyette Parmakkaya bölgesindeki klasik rotada tırmanış gerçekleştirdik. Hava koşulları uygundu ve ekipmanlarımız yeterliydi.</p><h3>Detaylar</h3><ul><li>Rota: Parmakkaya Klasik</li><li>Zorluk: Orta</li><li>Süre: 6 saat</li></ul>',
                'Parmakkaya, Antalya',
                '2024-01-15',
                '6 saat',
                'Orta',
                8,
                'Güneşli, 18°C',
                'Tırmanış halatları, karabinler, emniyet kemerleri',
                'Parmakkaya bölgesindeki klasik rota, 150m yükseklik, 6 pitch',
                'Rüzgarın artması ve bazı bölgelerde kayganlık',
                'Grup çalışmasının önemi ve hava durumunun dikkatli takibi',
                'Bu rotayı tekrar denemek isteyenlere sabah erken saatleri önerilir',
                '["1752680654515-417077862-yosemite-national-park-california-valley-landscape-misty-3840x2160-4321.jpg"]'
            )
        `);
        
        console.log('✅ Örnek faaliyet raporu başarıyla eklendi!');
        
        connection.release();
        
        console.log('🎉 Activity Reports tablosu ve örnek veri başarıyla oluşturuldu!');
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        process.exit(0);
    }
}

// Scripti çalıştır
createActivityReportsTable(); 
