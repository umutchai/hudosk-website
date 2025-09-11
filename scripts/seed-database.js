const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function seedDatabase() {
    try {
        console.log('🌱 Veritabanı seed işlemi başlatılıyor...');
        
        // Admin kullanıcısı oluştur
        await createAdminUser();
        
        // Örnek faaliyetler ekle
        await createSampleActivities();
        
        // Örnek eğitim programları ekle
        await createSampleEducationPrograms();
        
        console.log('✅ Veritabanı seed işlemi tamamlandı!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Seed işlemi sırasında hata:', error);
        process.exit(1);
    }
}

async function createAdminUser() {
    try {
        const connection = await pool.getConnection();
        
        // Mevcut admin kontrolü
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['ucumutcay@gmail.com']
        );
        
        if (existingUsers.length > 0) {
            console.log('👤 Admin kullanıcısı zaten mevcut');
            connection.release();
            return;
        }
        
        // Admin kullanıcısı oluştur
        const hashedPassword = await bcrypt.hash('ikisogukbiramvarabi6', 12);
        
        await connection.execute(
            `INSERT INTO users (email, password, role, full_name, is_active) 
             VALUES (?, ?, ?, ?, ?)`,
            ['ucumutcay@gmail.com', hashedPassword, 'admin', 'Admin User', 1]
        );
        
        console.log('👤 Admin kullanıcısı oluşturuldu');
        connection.release();
        
    } catch (error) {
        console.error('Admin kullanıcısı oluşturma hatası:', error);
        throw error;
    }
}

async function createSampleActivities() {
    try {
        const connection = await pool.getConnection();
        
        // Mevcut faaliyet kontrolü
        const [existingActivities] = await connection.execute('SELECT COUNT(*) as count FROM activities');
        
        if (existingActivities[0].count > 0) {
            console.log('🏃 Faaliyetler zaten mevcut');
            connection.release();
            return;
        }
        
        const sampleActivities = [
            {
                title: 'Aladağlar Tırmanış Kampı',
                description: 'Aladağlar\'da 3 günlük tırmanış kampımızda 8 farklı rotada tırmanış gerçekleştirdik. Katılımcılarımız hem temel hem de ileri seviye teknikleri öğrenme fırsatı buldu.',
                type: 'climbing',
                location: 'Aladağlar',
                date_start: '2024-11-15',
                date_end: '2024-11-17',
                difficulty_level: 'intermediate',
                status: 'completed'
            },
            {
                title: 'Güvenli Tırmanış Teknikleri Eğitimi',
                description: 'Başlangıç seviyesindeki tırmanışçılar için güvenlik ekipmanlarının kullanımı ve temel güvenlik prosedürlerini kapsayan teorik ve pratik eğitim.',
                type: 'course',
                location: 'Okul Duvarı',
                date_start: '2024-11-08',
                date_end: '2024-11-08',
                difficulty_level: 'beginner',
                status: 'completed'
            },
            {
                title: 'Kapadokya Doğa Kampı',
                description: 'Kapadokya\'nın eşsiz doğal güzelliklerinde 4 günlük kamp deneyimi. Vadiler arası yürüyüş, kaya formasyonları keşfi ve gece gökyüzü gözlemi.',
                type: 'camping',
                location: 'Kapadokya',
                date_start: '2024-10-25',
                date_end: '2024-10-28',
                difficulty_level: 'beginner',
                status: 'completed'
            },
            {
                title: 'Spor Tırmanış Yarışması',
                description: 'Yerel tırmanış topluluklarının katıldığı spor tırmanış yarışması. Farklı kategorilerde gerçekleşen heyecan dolu bir etkinlik.',
                type: 'climbing',
                location: 'Spor Salonu',
                date_start: '2024-10-12',
                date_end: '2024-10-12',
                difficulty_level: 'advanced',
                status: 'completed'
            },
            {
                title: 'Kış Dağcılığı Hazırlık Kampı',
                description: 'Kış sezonuna hazırlık için temel kış dağcılığı teknikleri ve ekipman kullanımı eğitimi.',
                type: 'course',
                location: 'Hasandağı',
                date_start: '2024-12-20',
                date_end: '2024-12-22',
                difficulty_level: 'intermediate',
                status: 'active'
            },
            {
                title: 'Yeni Başlayanlar İçin Doğa Yürüyüşü',
                description: 'Doğa sporlarına yeni başlayanlar için güvenli yürüyüş teknikleri ve doğa bilinci eğitimi.',
                type: 'hiking',
                location: 'Kıbrısköy Kanyonu',
                date_start: '2024-12-15',
                date_end: '2024-12-15',
                difficulty_level: 'beginner',
                status: 'active'
            }
        ];
        
        for (const activity of sampleActivities) {
            await connection.execute(
                `INSERT INTO activities 
                (title, description, type, location, date_start, date_end, difficulty_level, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    activity.title,
                    activity.description,
                    activity.type,
                    activity.location,
                    activity.date_start,
                    activity.date_end,
                    activity.difficulty_level,
                    activity.status
                ]
            );
        }
        
        console.log(`🏃 ${sampleActivities.length} örnek faaliyet eklendi`);
        connection.release();
        
    } catch (error) {
        console.error('Örnek faaliyetler oluşturma hatası:', error);
        throw error;
    }
}

async function createSampleEducationPrograms() {
    try {
        const connection = await pool.getConnection();
        
        // Mevcut eğitim programı kontrolü
        const [existingPrograms] = await connection.execute('SELECT COUNT(*) as count FROM education_programs');
        
        if (existingPrograms[0].count > 0) {
            console.log('🎓 Eğitim programları zaten mevcut');
            connection.release();
            return;
        }
        
        const samplePrograms = [
            {
                title: 'Temel Kampçılık Eğitimi',
                description: 'Doğada kamp kurma ve yaşam becerilerini öğreten temel eğitim programı. Çadır kurma, uyku tulumu kullanma, doğada yemek hazırlama gibi temel becerileri kapsar.',
                difficulty_level: 'beginner',
                duration: '2-3 Gün',
                location: 'Kıbrısköy Kanyonu',
                instructor: 'Ahmet Kaya',
                start_date: '2024-12-15',
                end_date: '2024-12-17',
                topics: JSON.stringify([
                    'Çadır kurma teknikleri',
                    'Uyku tulumu ve mat kullanımı',
                    'Doğada yürüyüş kuralları',
                    'Çanta toplama ve düzenleme',
                    'Doğada yemek hazırlama',
                    'Doğru giyinme teknikleri',
                    'Yürüyüş düzeni ve güvenlik',
                    'Faaliyet raporu yazma'
                ]),
                prerequisites: JSON.stringify([
                    'Üyelik formunu doldurmuş olmak',
                    'Beslenme, Giyinme ve Geceleme Teknikleri teorik derslerini almış olmak'
                ]),
                status: 'active'
            },
            {
                title: 'Temel Tırmanış Eğitimi',
                description: 'Tırmanış sporuna giriş için temel bilgiler ve güvenlik kuralları. Emniyet kemeri kullanımı, düğüm teknikleri ve temel tırmanış hareketleri.',
                difficulty_level: 'beginner',
                duration: '2 Gün',
                location: 'Okul Duvarı',
                instructor: 'Mehmet Yılmaz',
                start_date: '2024-12-20',
                end_date: '2024-12-21',
                topics: JSON.stringify([
                    'Temel güvenlik kuralları',
                    'Emniyet kemeri kullanımı',
                    'Düğüm teknikleri',
                    'Temel tırmanış hareketleri',
                    'İniş teknikleri',
                    'Ekipman bakımı'
                ]),
                prerequisites: JSON.stringify([
                    '18 yaşını doldurmuş olmak',
                    'Sağlık raporu'
                ]),
                status: 'active'
            }
        ];
        
        for (const program of samplePrograms) {
            await connection.execute(
                `INSERT INTO education_programs 
                (title, description, difficulty_level, duration, location, instructor, start_date, end_date, topics, prerequisites, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    program.title,
                    program.description,
                    program.difficulty_level,
                    program.duration,
                    program.location,
                    program.instructor,
                    program.start_date,
                    program.end_date,
                    program.topics,
                    program.prerequisites,
                    program.status
                ]
            );
        }
        
        console.log(`🎓 ${samplePrograms.length} örnek eğitim programı eklendi`);
        connection.release();
        
    } catch (error) {
        console.error('Örnek eğitim programları oluşturma hatası:', error);
        throw error;
    }
}

// Script'i çalıştır
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase }; 