const { pool } = require('../config/database');

async function testSingleActivity() {
    try {
        const testId = 6; // Test için ID 6'yı kullanıyoruz
        console.log(`🔍 ID ${testId} ile faaliyet detayını test ediyorum...`);
        
        const connection = await pool.getConnection();
        
        const [activities] = await connection.execute(
            'SELECT * FROM activities WHERE id = ?',
            [testId]
        );
        
        if (activities.length === 0) {
            console.log('❌ Faaliyet bulunamadı');
        } else {
            const activity = activities[0];
            console.log('✅ Faaliyet bulundu:');
            console.log('  - ID:', activity.id);
            console.log('  - Başlık:', activity.title);
            console.log('  - Tarih:', activity.activity_date);
            console.log('  - Bölge:', activity.region);
            console.log('  - Açıklama:', activity.report_description ? activity.report_description.substring(0, 50) + '...' : 'Yok');
            
            // JSON alanları kontrol et
            try {
                const reportPhotos = activity.report_photos ? JSON.parse(activity.report_photos) : [];
                console.log('  - Rapor Fotoğrafları:', reportPhotos.length, 'adet');
            } catch (e) {
                console.log('  - Rapor Fotoğrafları: JSON parse hatası');
            }
        }
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        process.exit(0);
    }
}

testSingleActivity(); 