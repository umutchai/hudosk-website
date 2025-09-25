require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'Huddosk',
    port: 3306,
    charset: 'utf8mb4'
};

async function checkActivitiesData() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🔍 Faaliyet raporları kontrol ediliyor...\n');
        
        // Tüm faaliyetleri listele
        const [activities] = await connection.execute(`
            SELECT 
                id,
                title,
                activity_date,
                region,
                route,
                report_writer,
                status,
                created_at,
                updated_at
            FROM activities 
            ORDER BY created_at DESC
        `);
        
        console.log(`📊 Toplam ${activities.length} faaliyet raporu bulundu:\n`);
        
        if (activities.length === 0) {
            console.log('❌ Henüz faaliyet raporu eklenmemiş!');
        } else {
            activities.forEach((activity, index) => {
                console.log(`${index + 1}. ${activity.title}`);
                console.log(`   📅 Tarih: ${activity.activity_date}`);
                console.log(`   📍 Bölge: ${activity.region || 'Belirtilmemiş'}`);
                console.log(`   🛤️  Rota: ${activity.route || 'Belirtilmemiş'}`);
                console.log(`   👤 Rapor Yazarı: ${activity.report_writer || 'Belirtilmemiş'}`);
                console.log(`   📊 Durum: ${activity.status}`);
                console.log(`   🕐 Oluşturulma: ${activity.created_at}`);
                console.log('');
            });
        }
        
        // Son eklenen faaliyetin detaylarını göster
        if (activities.length > 0) {
            const latestActivity = activities[0];
            console.log('🔍 Son eklenen faaliyetin detayları:');
            
            const [details] = await connection.execute(`
                SELECT * FROM activities WHERE id = ?
            `, [latestActivity.id]);
            
            if (details.length > 0) {
                const activity = details[0];
                console.log(JSON.stringify(activity, null, 2));
            }
        }
        
        // İstatistikler
        console.log('\n📈 İstatistikler:');
        const [stats] = await connection.execute(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
                COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
                MIN(created_at) as first_created,
                MAX(created_at) as last_created
            FROM activities
        `);
        
        console.log(`   📊 Toplam: ${stats[0].total}`);
        console.log(`   ✅ Aktif: ${stats[0].active}`);
        console.log(`   ❌ Pasif: ${stats[0].inactive}`);
        console.log(`   📅 İlk Eklenme: ${stats[0].first_created}`);
        console.log(`   📅 Son Eklenme: ${stats[0].last_created}`);
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        await connection.end();
    }
}

checkActivitiesData(); 
