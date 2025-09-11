const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'timsah67.',
    database: 'Huddosk',
    port: 3306,
    charset: 'utf8mb4'
};

async function recreateActivitiesTable() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🗑️ Eski activities tablosu siliniyor...');
        await connection.execute('DROP TABLE IF EXISTS activities');
        
        console.log('🏗️ Yeni activities tablosu oluşturuluyor...');
        const createTableQuery = `
            CREATE TABLE activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL COMMENT 'Faaliyet başlığı',
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
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ Activities tablosu başarıyla oluşturuldu');
        
        // Örnek veri ekle
        console.log('📝 Örnek veri ekleniyor...');
        const insertSampleData = `
            INSERT INTO activities (
                title, activity_date, region, route, team, technical_equipment, 
                weather_conditions, report_writer, pre_activity_description,
                report_description, descent_description, opinions
            ) VALUES (
                'Parmakkaya Klasik Rota Faaliyet Raporu',
                '2024-01-15',
                'Parmakkaya, Ankara',
                'Klasik Rota',
                'Ekip Lideri: Ahmet Yılmaz\nKatılımcılar: Mehmet Demir, Ayşe Kaya, Ali Özkan',
                'Tırmanış halatları, karabinler, emniyet kemerleri, kasklar, tırmanış ayakkabıları',
                'Güneşli, 18°C, rüzgar hafif',
                'Ahmet Yılmaz',
                'Faaliyet öncesi gerekli hazırlıklar tamamlandı. Tüm ekipmanlar kontrol edildi ve güvenlik önlemleri alındı.',
                'Klasik rota üzerinde başarılı bir tırmanış gerçekleştirildi. Rota teknik açıdan zorlayıcı ancak güvenliydi.',
                'İniş sırasında herhangi bir sorun yaşanmadı. Tüm güvenlik prosedürleri uygulandı.',
                'Genel olarak başarılı bir faaliyet oldu. Ekip uyumu mükemmeldi ve güvenlik standartlarına tam uyum sağlandı.'
            )
        `;
        
        await connection.execute(insertSampleData);
        console.log('✅ Örnek veri başarıyla eklendi');
        
        // Tablo yapısını kontrol et
        const [columns] = await connection.execute('DESCRIBE activities');
        console.log('\n📋 Tablo yapısı:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type}`);
        });
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await connection.end();
    }
}

recreateActivitiesTable(); 