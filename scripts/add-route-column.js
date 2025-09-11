const mysql = require('mysql2/promise');
const config = require('../config/database');

async function addRouteColumn() {
    const connection = await mysql.createConnection(config);
    
    try {
        // Add route column if it doesn't exist
        await connection.execute('ALTER TABLE activities ADD COLUMN IF NOT EXISTS route VARCHAR(255) COMMENT "Rota"');
        console.log('✅ Route column added successfully');
        
        // Check if table exists and show structure
        const [columns] = await connection.execute('DESCRIBE activities');
        console.log('📋 Current table structure:');
        columns.forEach(col => {
            console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
        });
        
    } catch (error) {
        console.error('❌ Error updating activities table:', error);
    } finally {
        await connection.end();
    }
}

addRouteColumn(); 