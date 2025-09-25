const { pool } = require('../config/database');

async function testActivities() {
    try {
        console.log('🔍 Activities tablosunu kontrol ediyorum...');
        
        const connection = await pool.getConnection();
        
        // Tablo yapısını kontrol et
        const [columns] = await connection.execute('DESCRIBE activities');
        console.log('📋 Activities tablosu kolonları:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type}`);
        });
        
        // Veri sayısını kontrol et
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM activities');
        console.log(`📊 Toplam faaliyet sayısı: ${countResult[0].total}`);
        
        // İlk birkaç kaydı kontrol et
        const [activities] = await connection.execute('SELECT id, title, activity_date FROM activities LIMIT 5');
        console.log('📝 İlk 5 faaliyet:');
        activities.forEach(activity => {
            console.log(`  - ID: ${activity.id}, Başlık: ${activity.title}, Tarih: ${activity.activity_date}`);
        });
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        process.exit(0);
    }
}

testActivities(); 
