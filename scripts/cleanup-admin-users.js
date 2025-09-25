const { pool } = require('../config/database');

async function cleanupAdminUsers() {
    try {
        const connection = await pool.getConnection();
        
        console.log('🔄 Admin kullanıcıları temizleniyor...');
        
        // Önce mevcut admin kullanıcılarını listele
        const [existingAdmins] = await connection.execute(`
            SELECT id, username, email, role FROM users WHERE role = 'admin'
        `);
        
        console.log('📋 Mevcut admin kullanıcıları:');
        existingAdmins.forEach(user => {
            console.log(`  - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
        });
        
        // ucumutcay@gmail.com hariç diğer admin kullanıcılarını sil
        const [deleteResult] = await connection.execute(`
            DELETE FROM users WHERE role = 'admin' AND email != 'ucumutcay@gmail.com'
        `);
        
        console.log(`✅ ${deleteResult.affectedRows} admin kullanıcısı silindi!`);
        
        // Kalan admin kullanıcılarını kontrol et
        const [remainingAdmins] = await connection.execute(`
            SELECT id, username, email, role FROM users WHERE role = 'admin'
        `);
        
        console.log('📋 Kalan admin kullanıcıları:');
        remainingAdmins.forEach(user => {
            console.log(`  - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
        });
        
        // ucumutcay@gmail.com kullanıcısı yoksa oluştur
        if (remainingAdmins.length === 0) {
            console.log('📧 ucumutcay@gmail.com kullanıcısı bulunamadı, oluşturuluyor...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await connection.execute(`
                INSERT INTO users (username, email, password, role) 
                VALUES (?, ?, ?, ?)
            `, ['ucumutcay', 'ucumutcay@gmail.com', hashedPassword, 'admin']);
            
            console.log('✅ ucumutcay@gmail.com kullanıcısı oluşturuldu!');
            console.log('🔑 Şifre: admin123');
        }
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Hata:', error.message);
    } finally {
        process.exit(0);
    }
}

// Scripti çalıştır
cleanupAdminUsers(); 
