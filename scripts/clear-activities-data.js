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

async function clearActivitiesData() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('🗑️ Mevcut faaliyet verileri temizleniyor...');
        
        // Tüm faaliyetleri sil
        const [result] = await connection.execute('DELETE FROM activities');
        
        console.log(`✅ ${result.affectedRows} faaliyet raporu silindi!`);
        console.log('📋 Veritabanı temizlendi, artık yeni veriler ekleyebilirsiniz.');
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        await connection.end();
    }
}

clearActivitiesData(); 
