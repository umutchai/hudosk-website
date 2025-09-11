const path = require('path');

class HomeController {
    // Ana sayfa
    static index(req, res) {
        try {
            res.sendFile(path.join(__dirname, '../public', 'index.html'));
        } catch (error) {
            console.error('Ana sayfa yüklenirken hata:', error);
            res.status(500).send('Sunucu hatası');
        }
    }

    // API endpoint - site istatistikleri
    static getStats(req, res) {
        const stats = {
            totalMembers: 500,
            totalActivities: 100,
            totalRoutes: 50,
            experienceYears: 6,
            lastActivity: '15 Kasım 2024',
            nextEvent: 'Kapadokya Tırmanış Kampı - 25 Aralık 2024'
        };

        res.json({
            success: true,
            data: stats
        });
    }

    // Hakkında bilgileri
    static getAbout(req, res) {
        const aboutInfo = {
            name: 'HÜDDOSK',
            fullName: 'Doğa Sporları ve Tırmanış Topluluğu',
            foundedYear: 2018,
            mission: 'Doğanın büyüleyici güçüyle insanları buluşturma misyonuyla yola çıkan topluluğumuz, güvenli ve eğlenceli doğa sporları deneyimleri sunmayı hedefler.',
            vision: 'Türkiye\'nin en güvenilir ve kapsamlı doğa sporları topluluğu olmak.',
            values: ['Güvenlik', 'Doğa Koruma', 'Topluluk', 'Eğitim', 'Deneyim Paylaşımı']
        };

        res.json({
            success: true,
            data: aboutInfo
        });
    }
}

module.exports = HomeController; 