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

async function checkPhotoData() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🔍 Fotoğraf verileri detaylı kontrol ediliyor...');
        
        // Tüm faaliyetlerin fotoğraf verilerini kontrol et
        const [activities] = await connection.execute(`
            SELECT id, title, cover_photo, report_photos, pre_activity_photos, opinion_photos
            FROM activities 
            ORDER BY id
        `);
        
        console.log(`\n📊 Toplam faaliyet sayısı: ${activities.length}`);
        
        activities.forEach(activity => {
            console.log(`\n--- ID: ${activity.id} - ${activity.title} ---`);
            console.log(`Kapak Fotoğrafı: ${activity.cover_photo || 'NULL'}`);
            
            // report_photos kontrol
            if (activity.report_photos) {
                try {
                    const parsed = JSON.parse(activity.report_photos);
                    if (Array.isArray(parsed)) {
                        console.log(`Rapor Fotoğrafları (${parsed.length} adet): ${parsed.join(', ')}`);
                    } else {
                        console.log(`Rapor Fotoğrafları (tek dosya): ${parsed}`);
                    }
                } catch (e) {
                    console.log(`Rapor Fotoğrafları (parse hatası): ${activity.report_photos}`);
                }
            } else {
                console.log('Rapor Fotoğrafları: NULL');
            }
            
            // pre_activity_photos kontrol
            if (activity.pre_activity_photos) {
                try {
                    const parsed = JSON.parse(activity.pre_activity_photos);
                    if (Array.isArray(parsed)) {
                        console.log(`Ön Faaliyet Fotoğrafları (${parsed.length} adet): ${parsed.join(', ')}`);
                    } else {
                        console.log(`Ön Faaliyet Fotoğrafları (tek dosya): ${parsed}`);
                    }
                } catch (e) {
                    console.log(`Ön Faaliyet Fotoğrafları (parse hatası): ${activity.pre_activity_photos}`);
                }
            } else {
                console.log('Ön Faaliyet Fotoğrafları: NULL');
            }
            
            // opinion_photos kontrol
            if (activity.opinion_photos) {
                try {
                    const parsed = JSON.parse(activity.opinion_photos);
                    if (Array.isArray(parsed)) {
                        console.log(`Görüş Fotoğrafları (${parsed.length} adet): ${parsed.join(', ')}`);
                    } else {
                        console.log(`Görüş Fotoğrafları (tek dosya): ${parsed}`);
                    }
                } catch (e) {
                    console.log(`Görüş Fotoğrafları (parse hatası): ${activity.opinion_photos}`);
                }
            } else {
                console.log('Görüş Fotoğrafları: NULL');
            }
        });
        
        // Uploads klasöründeki fotoğrafları kontrol et
        console.log('\n\n📁 Uploads klasörü kontrol ediliyor...');
        const fs = require('fs');
        const path = require('path');
        
        const uploadsPath = path.join(__dirname, '../uploads/activity-photos');
        if (fs.existsSync(uploadsPath)) {
            const files = fs.readdirSync(uploadsPath);
            console.log(`Activity-photos klasöründe ${files.length} dosya bulundu:`);
            files.slice(0, 10).forEach(file => {
                console.log(`  - ${file}`);
            });
            if (files.length > 10) {
                console.log(`  ... ve ${files.length - 10} dosya daha`);
            }
        } else {
            console.log('Activity-photos klasörü bulunamadı!');
        }
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        await connection.end();
    }
}

checkPhotoData(); 
