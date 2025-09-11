const { pool } = require('../config/database');

async function removeDescentColumns() {
    try {
        console.log('🔍 Removing descent columns from activities table...');
        
        const connection = await pool.getConnection();
        
        // Check if columns exist before removing
        const [columns] = await connection.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'activities' 
            AND COLUMN_NAME IN ('descent_description', 'descent_photos')
        `);
        
        console.log('📋 Found columns:', columns.map(col => col.COLUMN_NAME));
        
        // Remove descent_description column if it exists
        if (columns.some(col => col.COLUMN_NAME === 'descent_description')) {
            console.log('🗑️ Removing descent_description column...');
            await connection.execute('ALTER TABLE activities DROP COLUMN descent_description');
            console.log('✅ descent_description column removed');
        }
        
        // Remove descent_photos column if it exists
        if (columns.some(col => col.COLUMN_NAME === 'descent_photos')) {
            console.log('🗑️ Removing descent_photos column...');
            await connection.execute('ALTER TABLE activities DROP COLUMN descent_photos');
            console.log('✅ descent_photos column removed');
        }
        
        // Verify the table structure
        const [tableStructure] = await connection.execute('DESCRIBE activities');
        console.log('📋 Updated table structure:');
        tableStructure.forEach(column => {
            console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
        });
        
        connection.release();
        console.log('✅ Descent columns removal completed successfully!');
        
    } catch (error) {
        console.error('❌ Error removing descent columns:', error);
        console.error('❌ Error stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

removeDescentColumns();
