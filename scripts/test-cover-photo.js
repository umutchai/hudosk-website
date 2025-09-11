const mysql = require('mysql2/promise');

// Veritabanı konfigürasyonu
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'timsah67.',
    database: process.env.DB_NAME || 'Huddosk',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
};

// Connection pool oluştur
const pool = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10
});

async function testCoverPhoto() {
    try {
        const connection = await pool.getConnection();
        
        // Tablo yapısını kontrol et
        console.log('🔍 Checking table structure...');
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'activities'
            ORDER BY ORDINAL_POSITION
        `, [dbConfig.database]);
        
        console.log('📊 Table structure:');
        columns.forEach(col => {
            console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
        });
        
        // Mevcut kayıtları kontrol et
        console.log('\n🔍 Checking existing records...');
        const [activities] = await connection.execute(`
            SELECT id, title, cover_photo, activity_date 
            FROM activities 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        
        console.log('📊 Existing activities:');
        activities.forEach(activity => {
            console.log(`  ID: ${activity.id}`);
            console.log(`    Title: ${activity.title}`);
            console.log(`    Cover Photo: ${activity.cover_photo || 'Yok'}`);
            console.log(`    Date: ${activity.activity_date}`);
            console.log('');
        });
        
        // API endpoint'ini test et
        console.log('🔍 Testing API endpoint...');
        const response = await fetch('http://localhost:8080/api/activities');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API response received');
            console.log(`📊 Total activities: ${data.total}`);
            if (data.data && data.data.length > 0) {
                const firstActivity = data.data[0];
                console.log(`📸 First activity cover photo: ${firstActivity.cover_photo || 'Yok'}`);
            }
        } else {
            console.log('❌ API request failed');
        }
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
    } finally {
        await pool.end();
    }
}

testCoverPhoto();
