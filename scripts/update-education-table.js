const { pool } = require('../config/database');

async function updateEducationTable() {
    try {
        const connection = await pool.getConnection();
        
        console.log('🔄 Eğitim programları tablosu güncelleniyor...');
        
        // Önce mevcut tabloyu yedekle
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS education_programs_backup AS 
            SELECT * FROM education_programs
        `);
        console.log('✅ Tablo yedeklendi');
        
        // Eski kolonları sil (eğer varsa)
        try {
            await connection.execute('ALTER TABLE education_programs DROP COLUMN max_participants');
            console.log('✅ max_participants kolonu silindi');
        } catch (error) {
            console.log('ℹ️ max_participants kolonu zaten yok');
        }
        
        try {
            await connection.execute('ALTER TABLE education_programs DROP COLUMN current_participants');
            console.log('✅ current_participants kolonu silindi');
        } catch (error) {
            console.log('ℹ️ current_participants kolonu zaten yok');
        }
        
        try {
            await connection.execute('ALTER TABLE education_programs DROP COLUMN price');
            console.log('✅ price kolonu silindi');
        } catch (error) {
            console.log('ℹ️ price kolonu zaten yok');
        }
        
        // Curriculum kolonunu ekle (eğer yoksa)
        try {
            await connection.execute('ALTER TABLE education_programs ADD COLUMN curriculum JSON AFTER prerequisites');
            console.log('✅ curriculum kolonu eklendi');
        } catch (error) {
            console.log('ℹ️ curriculum kolonu zaten mevcut');
        }
        
        connection.release();
        console.log('✅ Eğitim programları tablosu başarıyla güncellendi!');
        
    } catch (error) {
        console.error('❌ Tablo güncelleme hatası:', error.message);
    }
}

// Scripti çalıştır
updateEducationTable().then(() => {
    console.log('🎉 Güncelleme tamamlandı!');
    process.exit(0);
}).catch((error) => {
    console.error('💥 Hata:', error);
    process.exit(1);
}); 