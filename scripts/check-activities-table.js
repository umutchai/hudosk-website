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

async function checkActivitiesTable() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🔍 Activities tablosu kontrol ediliyor...');
        
        // Tablo yapısını kontrol et
        const [columns] = await connection.execute('DESCRIBE activities');
        console.log('\n📋 Mevcut tablo yapısı:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
        });
        
        // Örnek veri kontrol et
        const [sampleData] = await connection.execute('SELECT * FROM activities LIMIT 1');
        console.log('\n📊 Örnek veri:');
        if (sampleData.length > 0) {
            console.log(JSON.stringify(sampleData[0], null, 2));
        } else {
            console.log('  Henüz veri yok');
        }
        
        // Form alanları ile karşılaştırma
        console.log('\n🔍 Form alanları ile karşılaştırma:');
        const formFields = [
            'title', 'activity_date', 'region', 'route', 'team', 
            'technical_equipment', 'weather_conditions', 'report_writer',
            'pre_activity_description', 'report_description', 
            'descent_description', 'opinions'
        ];
        
        const dbFields = columns.map(col => col.Field);
        
        formFields.forEach(field => {
            if (dbFields.includes(field)) {
                console.log(`  ✅ ${field}: Mevcut`);
            } else {
                console.log(`  ❌ ${field}: EKSİK`);
            }
        });
        
        // Eksik alanları kontrol et
        const missingFields = formFields.filter(field => !dbFields.includes(field));
        if (missingFields.length > 0) {
            console.log(`\n⚠️  Eksik alanlar: ${missingFields.join(', ')}`);
        } else {
            console.log('\n✅ Tüm form alanları veritabanında mevcut!');
        }
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        await connection.end();
    }
}

checkActivitiesTable(); 
