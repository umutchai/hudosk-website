const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'timsah67.',
    database: 'Huddosk',
    port: 3306,
    charset: 'utf8mb4'
};

async function debugJsonData() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🔍 JSON verileri debug ediliyor...\n');
        
        // Son eklenen faaliyetin ham verilerini göster
        const [activities] = await connection.execute(`
            SELECT 
                id,
                title,
                pre_activity_photos,
                report_photos,
                descent_photos,
                opinion_photos
            FROM activities 
            ORDER BY created_at DESC
            LIMIT 3
        `);
        
        activities.forEach((activity, index) => {
            console.log(`${index + 1}. ${activity.title} (ID: ${activity.id})`);
            console.log('   📸 Faaliyet Öncesi Fotoğrafları (ham veri):');
            console.log(`      "${activity.pre_activity_photos}"`);
            console.log('   📸 Rapor Fotoğrafları (ham veri):');
            console.log(`      "${activity.report_photos}"`);
            console.log('   📸 İniş Fotoğrafları (ham veri):');
            console.log(`      "${activity.descent_photos}"`);
            console.log('   📸 Görüşler Fotoğrafları (ham veri):');
            console.log(`      "${activity.opinion_photos}"`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        await connection.end();
    }
}

debugJsonData(); 