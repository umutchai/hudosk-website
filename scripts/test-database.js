require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabase() {
    try {
        console.log('🔄 Veritabanı bağlantısı test ediliyor...');
        
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'Huddosk',
            port: 3306
        });
        
        console.log('✅ Veritabanına başarıyla bağlandı!');
        
        // Activity reports tablosunu kontrol et
        const [tables] = await connection.execute(`
            SHOW TABLES LIKE 'activity_reports'
        `);
        
        if (tables.length > 0) {
            console.log('✅ Activity reports tablosu mevcut!');
            
            // Tablo yapısını kontrol et
            const [columns] = await connection.execute(`
                DESCRIBE activity_reports
            `);
            
            console.log('📋 Tablo yapısı:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type}`);
            });
            
            // Veri sayısını kontrol et
            const [count] = await connection.execute(`
                SELECT COUNT(*) as count FROM activity_reports
            `);
            
            console.log(`📊 Toplam ${count[0].count} kayıt var.`);
            
        } else {
            console.log('❌ Activity reports tablosu bulunamadı!');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    }
}

testDatabase(); 
