const { pool } = require('../config/database');

async function testCreateActivity() {
    try {
        console.log('🧪 Testing activity creation...');
        
        const connection = await pool.getConnection();
        
        // Test verisi
        const testData = {
            title: 'Test Faaliyet',
            cover_photo: null,
            activity_date: '2025-01-15',
            region: 'Test Bölge',
            route: 'Test Rota',
            team: 'Test Ekip',
            technical_equipment: 'Test Ekipman',
            weather_conditions: 'Güneşli',
            report_writer: 'Test Yazar',
            pre_activity_description: '<p>Test ön faaliyet açıklaması</p>',
            pre_activity_photos: null,
            report_description: '<p>Test rapor açıklaması</p>',
            report_photos: null,
            opinions: '<p>Test görüşler</p>',
            opinion_photos: null
        };
        
        console.log('📝 Test data:', testData);
        
        // INSERT işlemini test et
        const [result] = await connection.execute(
            `INSERT INTO activities 
            (title, cover_photo, activity_date, region, route, team, technical_equipment, weather_conditions, 
             report_writer, pre_activity_description, pre_activity_photos, 
             report_description, report_photos, opinions, opinion_photos) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                testData.title,
                testData.cover_photo,
                testData.activity_date,
                testData.region,
                testData.route,
                testData.team,
                testData.technical_equipment,
                testData.weather_conditions,
                testData.report_writer,
                testData.pre_activity_description,
                testData.pre_activity_photos,
                testData.report_description,
                testData.report_photos,
                testData.opinions,
                testData.opinion_photos
            ]
        );
        
        console.log('✅ Test activity created successfully!');
        console.log('📊 Insert result:', result);
        
        // Oluşturulan kaydı kontrol et
        const [rows] = await connection.execute(
            'SELECT * FROM activities WHERE title = ? ORDER BY id DESC LIMIT 1',
            [testData.title]
        );
        
        if (rows.length > 0) {
            console.log('✅ Retrieved test activity:', {
                id: rows[0].id,
                title: rows[0].title,
                activity_date: rows[0].activity_date
            });
        }
        
        connection.release();
        console.log('✅ Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('❌ Error stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

testCreateActivity();


