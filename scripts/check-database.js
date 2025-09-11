const mysql = require('mysql2/promise');
const config = require('../config/database');

async function checkDatabase() {
    const connection = await mysql.createConnection(config);
    
    try {
        console.log('🔍 Database kontrol ediliyor...');
        
        // Activities tablosunu kontrol et
        const [columns] = await connection.execute('DESCRIBE activities');
        console.log('\n📋 Activities tablosu yapısı:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
        });
        
        // Örnek veri kontrol et
        const [activities] = await connection.execute('SELECT COUNT(*) as count FROM activities');
        console.log(`\n📊 Toplam faaliyet sayısı: ${activities[0].count}`);
        
        if (activities[0].count > 0) {
            const [sample] = await connection.execute('SELECT * FROM activities LIMIT 1');
            console.log('\n📝 Örnek faaliyet:');
            console.log(JSON.stringify(sample[0], null, 2));
        }
        
    } catch (error) {
        console.error('❌ Database kontrol hatası:', error);
    } finally {
        await connection.end();
    }
}

checkDatabase(); 