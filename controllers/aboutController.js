const path = require('path');

class AboutController {
    // Biz kimiz sayfası
    static index(req, res) {
        try {
            res.sendFile(path.join(__dirname, '../public', 'biz-kimiz.html'));
        } catch (error) {
            console.error('Biz kimiz sayfası yüklenirken hata:', error);
            res.status(500).send('Sunucu hatası');
        }
    }

    // Ekip bilgilerini getir
    static getTeamMembers(req, res) {
        const teamMembers = [
            {
                id: 1,
                name: 'Ahmet Kaya',
                position: 'Kurucu & Baş Eğitmen',
                experience: '15 yıl',
                specialties: ['Spor Tırmanış', 'Alpinizm', 'Kaya Tırmanışı'],
                certifications: ['UIAA Sertifikalı Eğitmen', 'IFMGA Kılavuz', 'Wilderness First Aid'],
                bio: 'Tırmanış sporuna 15 yıl önce başlayan Ahmet, bugüne kadar 20\'den fazla ülkede tırmanış yapmış deneyimli bir sporcu ve eğitmendir.',
                achievements: [
                    'Everest Tırmanışı (2019)',
                    'Aladağlar Yeni Rota Açılışı (2020)',
                    '500+ kişiye eğitim verdi'
                ],
                contact: {
                    email: 'ahmet@hudosk.com',
                    phone: '+90 555 123 45 67'
                },
                avatar: 'team/ahmet.jpg',
                socialMedia: {
                    instagram: '@ahmet_climbing',
                    linkedin: 'ahmet-kaya-climber'
                }
            },
            {
                id: 2,
                name: 'Zeynep Demir',
                position: 'Eğitim Koordinatörü',
                experience: '10 yıl',
                specialties: ['İlk Yardım', 'Eğitim', 'Güvenlik Prosedürleri'],
                certifications: ['Spor Bilimleri Uzmanı', 'İlk Yardım Eğitmeni', 'Risk Yönetimi Sertifikası'],
                bio: 'Spor bilimleri alanında uzman olan Zeynep, eğitim programlarının geliştirilmesi ve güvenlik prosedürlerinin uygulanmasından sorumludur.',
                achievements: [
                    'Güvenlik protokollerini geliştirdi',
                    '300+ kişiye ilk yardım eğitimi verdi',
                    'UIAA Güvenlik Komisyonu üyesi'
                ],
                contact: {
                    email: 'zeynep@hudosk.com',
                    phone: '+90 555 234 56 78'
                },
                avatar: 'team/zeynep.jpg',
                socialMedia: {
                    instagram: '@zeynep_safety',
                    linkedin: 'zeynep-demir-safety'
                }
            },
            {
                id: 3,
                name: 'Can Öztürk',
                position: 'Teknik Eğitmen',
                experience: '12 yıl',
                specialties: ['Buz Tırmanış', 'Dağcılık', 'Alpinizm'],
                certifications: ['Buz Tırmanış Uzmanı', 'Dağcılık Rehberi', 'Avalanche Safety'],
                bio: 'Buz tırmanışı ve dağcılık konularında uzman olan Can, ekstrem koşullarda gerçekleştirilen eğitimlerin sorumlusudur.',
                achievements: [
                    'Mont Blanc Tırmanışı (2018)',
                    'Patagonia Ekspedisyonu (2021)',
                    'Buz tırmanış rotaları geliştirdi'
                ],
                contact: {
                    email: 'can@hudosk.com',
                    phone: '+90 555 345 67 89'
                },
                avatar: 'team/can.jpg',
                socialMedia: {
                    instagram: '@can_ice_climbing',
                    linkedin: 'can-ozturk-mountaineer'
                }
            },
            {
                id: 4,
                name: 'Elif Yılmaz',
                position: 'Fotoğraf & Medya Sorumlusu',
                experience: '8 yıl',
                specialties: ['Fotoğraf', 'Sosyal Medya', 'İçerik Üretimi'],
                certifications: ['Profesyonel Fotoğrafçı', 'Drone Pilotu', 'Digital Marketing'],
                bio: 'Doğa fotoğrafçılığı konusunda uzman olan Elif, HÜDDOSK\'un tüm görsel içeriklerinin üretiminden ve sosyal medya yönetiminden sorumludur.',
                achievements: [
                    'National Geographic fotoğraf yarışması finalist',
                    '50+ fotoğraf sergisi',
                    '100K+ takipçi sosyal medya'
                ],
                contact: {
                    email: 'elif@hudosk.com',
                    phone: '+90 555 456 78 90'
                },
                avatar: 'team/elif.jpg',
                socialMedia: {
                    instagram: '@elif_nature_photo',
                    linkedin: 'elif-yilmaz-photographer'
                }
            }
        ];

        res.json({
            success: true,
            data: teamMembers,
            total: teamMembers.length
        });
    }

    // Topluluk değerlerini getir
    static getValues(req, res) {
        const values = [
            {
                id: 1,
                title: 'Güvenlik',
                icon: 'fa-shield-alt',
                color: 'danger',
                description: 'Tüm faaliyetlerimizde güvenlik önceliğimizdir. Uluslararası standartlara uygun ekipman ve prosedürler kullanırız.',
                principles: [
                    'UIAA standartlarına uygunluk',
                    'Sürekli risk değerlendirmesi',
                    'Ekipman kontrolü',
                    'Acil durum prosedürleri'
                ]
            },
            {
                id: 2,
                title: 'Doğa Koruma',
                icon: 'fa-leaf',
                color: 'success',
                description: 'Doğal alanları koruma ve sürdürülebilirlik ilkelerine bağlı kalarak faaliyetlerimizi gerçekleştiririz.',
                principles: [
                    'Leave No Trace prensibi',
                    'Çevre bilinci eğitimi',
                    'Doğal habitat korunması',
                    'Sürdürülebilir turizm'
                ]
            },
            {
                id: 3,
                title: 'Topluluk',
                icon: 'fa-handshake',
                color: 'warning',
                description: 'Herkesin katılabileceği, öğrenebileceği ve deneyim paylaşabileceği kapsayıcı bir topluluk oluştururuz.',
                principles: [
                    'Kapsayıcılık',
                    'Deneyim paylaşımı',
                    'Mentörlük',
                    'Birlikte öğrenme'
                ]
            },
            {
                id: 4,
                title: 'Eğitim',
                icon: 'fa-graduation-cap',
                color: 'info',
                description: 'Kaliteli eğitim programlarıyla doğa sporları bilincini artırır, güvenli sporcular yetiştiririz.',
                principles: [
                    'Kaliteli eğitim',
                    'Sürekli gelişim',
                    'Teorik ve pratik denge',
                    'Sertifikasyon'
                ]
            }
        ];

        res.json({
            success: true,
            data: values,
            total: values.length
        });
    }

    // Topluluk istatistiklerini getir
    static getOrganizationStats(req, res) {
        const stats = {
            overview: {
                foundedYear: 2018,
                totalMembers: 500,
                totalActivities: 100,
                totalRoutes: 50,
                experienceYears: 6,
                activeCourses: 5,
                certifiedInstructors: 4
            },
            annual: {
                2024: {
                    activities: 25,
                    participants: 180,
                    newMembers: 120,
                    coursesCompleted: 15
                },
                2023: {
                    activities: 22,
                    participants: 165,
                    newMembers: 100,
                    coursesCompleted: 12
                },
                2022: {
                    activities: 18,
                    participants: 140,
                    newMembers: 85,
                    coursesCompleted: 10
                }
            },
            achievements: [
                {
                    year: 2024,
                    title: 'En İyi Doğa Sporları Topluluğu Ödülü',
                    organization: 'Türk Dağcılık Federasyonu'
                },
                {
                    year: 2023,
                    title: 'Güvenlik Standartları Sertifikası',
                    organization: 'UIAA'
                },
                {
                    year: 2022,
                    title: 'Çevre Koruma Ödülü',
                    organization: 'Doğa Koruma Vakfı'
                }
            ],
            partnerships: [
                'Türk Dağcılık Federasyonu',
                'UIAA (International Climbing Association)',
                'Patagonia Türkiye',
                'Black Diamond',
                'Arc\'teryx'
            ]
        };

        res.json({
            success: true,
            data: stats
        });
    }

    // İletişim bilgilerini getir
    static getContactInfo(req, res) {
        const contactInfo = {
            general: {
                email: 'info@hudosk.com',
                phone: '+90 555 123 45 67',
                address: {
                    street: 'Doğa Sporları Caddesi No: 123',
                    district: 'Beşiktaş',
                    city: 'İstanbul',
                    postalCode: '34357',
                    country: 'Türkiye'
                }
            },
            departments: {
                education: {
                    email: 'egitim@hudosk.com',
                    phone: '+90 555 234 56 78',
                    responsible: 'Zeynep Demir'
                },
                activities: {
                    email: 'faaliyetler@hudosk.com',
                    phone: '+90 555 345 67 89',
                    responsible: 'Ahmet Kaya'
                },
                media: {
                    email: 'medya@hudosk.com',
                    phone: '+90 555 456 78 90',
                    responsible: 'Elif Yılmaz'
                }
            },
            socialMedia: {
                instagram: '@hudosk_official',
                facebook: 'hudosk.official',
                twitter: '@hudosk',
                youtube: 'HUDDOSK Official',
                linkedin: 'hudosk'
            },
            officeHours: {
                weekdays: '09:00 - 18:00',
                saturday: '10:00 - 16:00',
                sunday: 'Kapalı'
            }
        };

        res.json({
            success: true,
            data: contactInfo
        });
    }

    // İletişim formu gönderimi
    static submitContactForm(req, res) {
        const { name, email, subject, message, department } = req.body;

        // Validasyon
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Ad, e-posta ve mesaj alanları zorunludur'
            });
        }

        // Burada form verisi işlenecek (email gönderimi, database'e kaydetme vs.)
        const submission = {
            id: Date.now(),
            name,
            email,
            subject: subject || 'Genel İletişim',
            message,
            department: department || 'general',
            submittedAt: new Date(),
            status: 'received'
        };

        res.status(201).json({
            success: true,
            message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
            data: submission
        });
    }

    // Topluluk tarihi ve kilometre taşları
    static getHistory(req, res) {
        const history = [
            {
                year: 2018,
                title: 'HÜDDOSK Kuruldu',
                description: 'Doğa sporları tutkunlarının bir araya gelmesiyle topluluk kuruldu.',
                milestone: true
            },
            {
                year: 2019,
                title: 'İlk Büyük Expedition',
                description: 'Aladağlar\'da 15 kişilik büyük tırmanış ekspedisyonu gerçekleştirildi.',
                milestone: false
            },
            {
                year: 2020,
                title: 'Eğitim Merkezi Açıldı',
                description: 'Resmi eğitim merkezimiz açılarak sertifikalı eğitimler başladı.',
                milestone: true
            },
            {
                year: 2021,
                title: 'UIAA Üyeliği',
                description: 'Uluslararası tırmanış federasyonu UIAA\'ya üye olduk.',
                milestone: true
            },
            {
                year: 2022,
                title: '100. Faaliyet',
                description: '100. faaliyetimizi Kapadokya\'da gerçekleştirdik.',
                milestone: false
            },
            {
                year: 2023,
                title: 'Güvenlik Sertifikası',
                description: 'UIAA güvenlik standartları sertifikasını aldık.',
                milestone: true
            },
            {
                year: 2024,
                title: '500+ Mezun',
                description: '500\'den fazla kişiye eğitim vererek sertifika verdik.',
                milestone: true
            }
        ];

        res.json({
            success: true,
            data: history,
            total: history.length
        });
    }
}

module.exports = AboutController; 