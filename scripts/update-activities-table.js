const mysql = require('mysql2/promise');
const config = require('../config/database');

async function updateActivitiesTable() {
    const connection = await mysql.createConnection(config);
    
    try {
        // Add new columns to activities table
        const alterQueries = [
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS route_description TEXT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS equipment_used TEXT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS challenges_faced TEXT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS lessons_learned TEXT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS recommendations TEXT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS duration VARCHAR(100)',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS participants_count INT',
            'ALTER TABLE activities ADD COLUMN IF NOT EXISTS weather_conditions VARCHAR(200)'
        ];
        
        for (const query of alterQueries) {
            await connection.execute(query);
            console.log(`✅ Executed: ${query}`);
        }
        
        console.log('✅ Activities table updated successfully');
        
    } catch (error) {
        console.error('❌ Error updating activities table:', error);
    } finally {
        await connection.end();
    }
}

updateActivitiesTable(); 