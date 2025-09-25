require('dotenv').config();
const mysql = require('mysql2/promise');
const config = require('../config/database');

async function createParmakkayaTable() {
    const connection = await mysql.createConnection(config);
    
    try {
        // Create parmakkaya_reports table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS parmakkaya_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                pdf_path VARCHAR(500) NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ Parmakkaya reports table created successfully');
        
        // Insert sample data
        const insertSampleData = `
            INSERT INTO parmakkaya_reports (title, description, pdf_path) VALUES
            ('HÜDDOSK Parmakkaya Klasik Rota Faaliyet Raporu', 'Klasik rota üzerinde gerçekleştirilen faaliyet raporu', 'HÜDDOSK Parmakkaya Klasik Rota Faaliyet Raporu.pdf'),
            ('Parmakkaya Zor Rota Deneyimi', 'Zorlu koşullarda gerçekleştirilen rota deneyimi', ''),
            ('Parmakkaya Yeni Başlayanlar Raporu', 'Yeni başlayanlar için uygun rota rehberi', '')
        `;
        
        await connection.execute(insertSampleData);
        console.log('✅ Sample parmakkaya reports data inserted');
        
    } catch (error) {
        console.error('❌ Error creating parmakkaya reports table:', error);
    } finally {
        await connection.end();
    }
}

createParmakkayaTable(); 
