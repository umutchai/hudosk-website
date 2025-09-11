const path = require('path');
const { pool } = require('../config/database');

class EducationController {
    // Eğitim programları sayfası
    static index(req, res) {
        try {
            res.sendFile(path.join(__dirname, '../public', 'egitim-programlari.html'));
        } catch (error) {
            console.error('Eğitim programları sayfası yüklenirken hata:', error);
            res.status(500).send('Sunucu hatası');
        }
    }

    // Tüm eğitim programlarını API olarak getir
    static async getAllProgramsAPI(req, res) {
        try {
            const connection = await pool.getConnection();
            const [programs] = await connection.execute(
                'SELECT * FROM education_programs ORDER BY difficulty_level, created_at DESC'
            );
            connection.release();

            // JSON alanları güvenli şekilde parse et
            const formattedPrograms = programs.map(program => {
                let prerequisites = [];
                let curriculum = [];
                try {
                    prerequisites = program.prerequisites ? JSON.parse(program.prerequisites) : [];
                    if (!Array.isArray(prerequisites)) prerequisites = [prerequisites];
                } catch (e) {
                    prerequisites = program.prerequisites ? [program.prerequisites] : [];
                }
                try {
                    curriculum = program.curriculum ? JSON.parse(program.curriculum) : [];
                    if (!Array.isArray(curriculum)) curriculum = [curriculum];
                } catch (e) {
                    curriculum = program.curriculum ? [program.curriculum] : [];
                }
                return {
                    ...program,
                    prerequisites,
                    curriculum
                };
            });

            res.json({
                success: true,
                data: formattedPrograms,
                total: formattedPrograms.length
            });
        } catch (error) {
            console.error('Education programs fetch error:', error, error?.stack);
            res.status(500).json({
                success: false,
                message: 'Eğitim programları yüklenirken hata oluştu',
                error: error?.message || error
            });
        }
    }

    // Admin paneli için eğitim programlarını getir
    static async getAdminPrograms(req, res) {
        try {
            const connection = await pool.getConnection();
            const [programs] = await connection.execute(
                'SELECT * FROM education_programs ORDER BY created_at DESC'
            );
            connection.release();

            // JSON alanları güvenli şekilde parse et
            const formattedPrograms = programs.map(program => {
                let topics = [];
                let prerequisites = [];
                let curriculum = [];
                try {
                    topics = program.topics ? JSON.parse(program.topics) : [];
                } catch (e) {
                    topics = [];
                }
                try {
                    prerequisites = program.prerequisites ? JSON.parse(program.prerequisites) : [];
                    if (!Array.isArray(prerequisites)) prerequisites = [prerequisites];
                } catch (e) {
                    prerequisites = program.prerequisites ? [program.prerequisites] : [];
                }
                try {
                    curriculum = program.curriculum ? JSON.parse(program.curriculum) : [];
                    if (!Array.isArray(curriculum)) curriculum = [curriculum];
                } catch (e) {
                    curriculum = program.curriculum ? [program.curriculum] : [];
                }
                return {
                    ...program,
                    topics,
                    prerequisites,
                    curriculum
                };
            });

            res.json({
                success: true,
                data: formattedPrograms,
                total: formattedPrograms.length
            });
        } catch (error) {
            console.error('Admin education programs fetch error:', error, error?.stack);
            res.status(500).json({
                success: false,
                message: 'Eğitim programları yüklenirken hata oluştu',
                error: error?.message || error
            });
        }
    }

    // Belirli bir eğitim programını getir
    static async getProgramByIdAPI(req, res) {
        try {
            const { id } = req.params;
            
            const connection = await pool.getConnection();
            const [programs] = await connection.execute(
                'SELECT * FROM education_programs WHERE id = ?',
                [id]
            );
            connection.release();

            if (programs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Eğitim programı bulunamadı'
                });
            }

            const program = programs[0];
            // JSON alanları güvenli şekilde parse et
            let topics = [];
            let prerequisites = [];
            let curriculum = [];
            try {
                topics = program.topics ? JSON.parse(program.topics) : [];
            } catch (e) {
                topics = [];
            }
            try {
                prerequisites = program.prerequisites ? JSON.parse(program.prerequisites) : [];
                if (!Array.isArray(prerequisites)) prerequisites = [prerequisites];
            } catch (e) {
                prerequisites = program.prerequisites ? [program.prerequisites] : [];
            }
            try {
                curriculum = program.curriculum ? JSON.parse(program.curriculum) : [];
                if (!Array.isArray(curriculum)) curriculum = [curriculum];
            } catch (e) {
                curriculum = program.curriculum ? [program.curriculum] : [];
            }
            const formattedProgram = {
                ...program,
                topics,
                prerequisites,
                curriculum
            };

            res.json({
                success: true,
                data: formattedProgram
            });
        } catch (error) {
            console.error('Education program fetch error:', error, error?.stack);
            res.status(500).json({
                success: false,
                message: 'Eğitim programı yüklenirken hata oluştu',
                error: error?.message || error
            });
        }
    }

    // Bizim verdiğimiz eğitimler
    static getOurPrograms(req, res) {
        const ourPrograms = [
            {
                id: 1,
                title: 'Temel Kampçılık Eğitimi',
                category: 'Temel Seviye',
                location: 'Kıbrısköy Kanyonu',
                timing: 'Güz dönemi vizelerden sonra',
                duration: '2-3 Gün',
                description: 'Doğada kamp kurma ve yaşam becerilerini öğreten temel eğitim programı.',
                topics: [
                    'Çadır kurma',
                    'Uyku tulumu ve mat kullanımı',
                    'Doğada yürüyüş',
                    'Çanta toplama',
                    'Doğada yemek hazırlama',
                    'Doğru giyinme teknikleri',
                    'Yürüyüş düzeni ve güvenlik',
                    'Faaliyet raporu yazma'
                ],
                prerequisites: ['Üyelik formunu doldurmuş olmak', 'Beslenme, Giyinme ve Geceleme Teknikleri teorik derslerini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2024-12-15'
            },
            {
                id: 2,
                title: 'Temel Tırmanış Eğitimi',
                category: 'Temel Seviye',
                location: 'Okul Duvarı',
                timing: 'Güz dönemi vizelerden sonra',
                duration: '2 Gün',
                description: 'Tırmanış sporuna giriş için temel bilgiler ve güvenlik kuralları.',
                topics: [
                    'Sekizli düğümü',
                    'Emniyet kemeri giyme',
                    'İpe girme',
                    'ATC kullanma',
                    'Top rope emniyet alma',
                    'Emniyetçi ve tırmanıcı arası komutlar',
                    'Basit tırmanış teknikleri',
                    'Tutamak isimleri'
                ],
                prerequisites: ['Temel Tırmanış teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2024-12-20'
            },
            {
                id: 3,
                title: 'Temel Kış Dağcılık Eğitimi',
                category: 'Orta Seviye',
                location: 'Hasandağı',
                timing: 'Bahar Dönemi Sonunda',
                duration: '3 Gün',
                description: 'Kış koşullarında dağcılık ve kar üzerinde hareket teknikleri.',
                topics: [
                    'Karda yürüyüş',
                    'Kazma ile düşme durma',
                    'Kazma Krampon ile yükselme teknikleri',
                    'Karda kamp becerileri',
                    'Kardan su elde etme',
                    'Kar duvarı örme'
                ],
                prerequisites: ['Temel Kış Dağcılığı teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2025-02-15'
            },
            {
                id: 4,
                title: 'İleri Tırmanış Eğitimi',
                category: 'İleri Seviye',
                location: 'Okul Duvarı',
                timing: 'Bahar Dönemi başında',
                duration: '3 Gün',
                description: 'İleri seviye tırmanış teknikleri ve liderlik becerileri.',
                topics: [
                    'Lider Tırmanış',
                    'İstasyon Toplama',
                    'Top rope kurma',
                    'Tırmanıcı düşüşü pratikleri',
                    'Düşüş yakalama pratikleri'
                ],
                prerequisites: ['İleri Tırmanış teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2025-02-20'
            },
            {
                id: 5,
                title: 'Temel Kaya Tırmanış Eğitimi',
                category: 'Orta Seviye',
                location: 'Karakaya Tırmanış Bahçesi',
                timing: 'Bahar Dönemi vizelerden sonra',
                duration: '2 Gün',
                description: 'Doğal kaya ortamında tırmanış ve düğüm teknikleri.',
                topics: [
                    'İp inişi',
                    'Kayada tırmanış',
                    'Kapalı sekizli',
                    'Tam kazık',
                    'Çifte Balıkçı',
                    'Karabinaya Tam Kazık'
                ],
                prerequisites: ['İleri Tırmanış teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2025-03-15'
            },
            {
                id: 6,
                title: 'Dağcılığa Giriş Eğitimi',
                category: 'İleri Seviye',
                location: 'Aladağlar',
                timing: 'Bahar Dönemi finallerden sonra',
                duration: '4 Gün',
                description: 'Çok günlü dağcılık ve bivak teknikleri.',
                topics: [
                    'Tam Boy İp İnişi',
                    'Düğümler (Tam Kazık, Kapalı Sekiz, Alpin Kelebek, Çifte Balıkçı, Kördüğüm, Yarım kazık, Perlon Bant)',
                    'Malzeme Yerleştirme (Hex, Cam, Nut)',
                    'Kaya Babası, Kum Saati ve Ağaçlardan perlon dolama',
                    'Dağda iletişim, komutlar',
                    'Bivak',
                    'Dağdaki doğal riskler (taş düşmesi, yağış, yıldırım düşmesi, çığ, güneş çarpması, hipotermi, kar körlüğü, dehidrasyon)'
                ],
                prerequisites: ['Dağcılık 101 teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2025-05-20'
            },
            {
                id: 7,
                title: 'İleri Kaya Eğitimi',
                category: 'Uzman Seviye',
                location: 'Sivridağ / Aladağlar',
                timing: 'Güz Dönemi vizelerden sonra',
                duration: '3 Gün',
                description: 'Geleneksel kaya tırmanışı ve lider tırmanış teknikleri.',
                topics: [
                    'Lider Geleneksel Tırmanış',
                    'Geleneksel İstasyon Kurma.'
                ],
                prerequisites: ['Geleneksel Kaya Tırmanışı 1 ve 2 teorik derslerini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2024-12-25'
            },
            {
                id: 8,
                title: 'İleri Kış Eğitimi',
                category: 'Uzman Seviye',
                location: 'Aladağlar',
                timing: 'Bahar dönemi başında',
                duration: '4 Gün',
                description: 'İleri seviye kış dağcılığı ve teknik buzul geçişleri.',
                topics: [
                    'Lider Geleneksel Tırmanış',
                    'Geleneksel İstasyon Kurma.'
                ],
                prerequisites: ['İleri Kış Dağcılığı teorik dersini almış olmak'],
                instructor: 'Arda Ünlü, Hasan Mert Taluy',
                certificate: true,
                nextDate: '2025-02-28'
            }
        ];
        res.json({ success: true, data: ourPrograms, total: ourPrograms.length });
    }

    // Eğitimlerin detaylı müfredatı
    static getCurriculum(req, res) {
        const curriculum = {
            temelKampcilık: {
                title: 'Temel Kampçılık Müfredatı',
                location: 'Kıbrısköy Kanyonu',
                duration: '2-3 Gün',
                topics: [
                    'Çadır kurma teknikleri',
                    'Uyku tulumu ve mat kullanımı',
                    'Doğada güvenli yürüyüş',
                    'Çanta toplama ve düzenleme',
                    'Doğada yemek hazırlama teknikleri',
                    'Doğru giyinme, incelme ve kalınlaşma',
                    'Yürüyüş düzeni ve grup yönetimi',
                    'Faaliyet raporu yazma teknikleri'
                ]
            },
            temelTirmanis: {
                title: 'Temel Tırmanış Müfredatı',
                location: 'Okul Duvarı',
                duration: '2 Gün',
                topics: [
                    'Sekizli düğümü tekniği',
                    'Emniyet kemeri doğru giyim',
                    'İpe girme teknikleri',
                    'ATC (Belay Device) kullanımı',
                    'Top rope emniyet alma',
                    'Emniyetçi ve tırmanıcı arası komutlar',
                    'Basit tırmanış teknikleri',
                    'Tutamak isimleri ve kullanım teknikleri'
                ]
            },
            temelKis: {
                title: 'Temel Kış Dağcılığı Müfredatı',
                location: 'Hasandağı',
                duration: '3 Gün',
                topics: [
                    'Karda güvenli yürüyüş teknikleri',
                    'Kazma ile düşme durdurma',
                    'Kazma ve krampon ile yükselme teknikleri',
                    'Karda kamp kurma becerileri',
                    'Kardan su elde etme yöntemleri',
                    'Kar duvarı örme teknikleri'
                ]
            },
            ileriTirmanis: {
                title: 'İleri Tırmanış Müfredatı',
                location: 'Okul Duvarı',
                duration: '3 Gün',
                topics: [
                    'Lider tırmanış teknikleri',
                    'İstasyon toplama ve kurma',
                    'Top rope kurma teknikleri',
                    'Tırmanıcı düşüşü pratikleri',
                    'Düşüş yakalama pratikleri'
                ]
            },
            temelKaya: {
                title: 'Temel Kaya Tırmanışı Müfredatı',
                location: 'Karakaya Tırmanış Bahçesi',
                duration: '2 Gün',
                topics: [
                    'İp inişi (rappel) teknikleri',
                    'Doğal kayada tırmanış',
                    'Kapalı sekizli düğümü',
                    'Tam kazık düğümü',
                    'Çifte balıkçı düğümü',
                    'Karabinaya tam kazık tekniği'
                ]
            },
            dagciliğaGiris: {
                title: 'Dağcılığa Giriş Müfredatı',
                location: 'Aladağlar',
                duration: '4 Gün',
                topics: [
                    'Tam boy ip inişi teknikleri',
                    'İleri düğümler (Tam Kazık, Kapalı Sekiz, Alpin Kelebek, Çifte Balıkçı, Kördüğüm, Yarım kazık, Perlon Bant)',
                    'Malzeme yerleştirme (Hex, Cam, Nut)',
                    'Kaya babası, kum saati ve ağaçlardan perlon dolama',
                    'Dağda iletişim ve komutlar',
                    'Bivak teknikleri',
                    'Dağdaki doğal riskler (taş düşmesi, yağış, yıldırım düşmesi, çığ, güneş çarpması, hipotermi, kar körlüğü, dehidrasyon)'
                ]
            },
            ileriKaya: {
                title: 'İleri Kaya Tırmanışı Müfredatı',
                location: 'Sivridağ / Aladağlar',
                duration: '3 Gün',
                topics: [
                    'Lider geleneksel tırmanış',
                    'Geleneksel istasyon kurma',
                    'İleri koruma teknikleri',
                    'Risk değerlendirmesi'
                ]
            },
            ileriKis: {
                title: 'İleri Kış Dağcılığı Müfredatı',
                location: 'Aladağlar',
                duration: '4 Gün',
                topics: [
                    'İleri kış tırmanış teknikleri',
                    'Buzul geçiş teknikleri',
                    'Kış kurtarma teknikleri',
                    'Ekstrem hava koşulları yönetimi'
                ]
            },
            alpinizm: {
                title: 'Alpinizme Giriş Müfredatı',
                location: 'Aladağlar',
                duration: '5 Gün',
                topics: [
                    'Yüksek irtifa dağcılığı teknikleri',
                    'Alpinizm rotaları planlama',
                    'Ekstrem hava koşulları yönetimi',
                    'Acil durum yönetimi',
                    'Yüksek irtifa fizyolojisi'
                ]
            }
        };

        res.json({
            success: true,
            data: curriculum
        });
    }

    // Eğitim ön koşulları
    static getPrerequisites(req, res) {
        const prerequisites = {
            basicLevel: {
                title: 'Temel Seviye Eğitimler',
                requirements: {
                    age: 'Minimum 16 yaş',
                    health: 'Genel sağlık durumu iyi olmalı',
                    fitness: 'Temel fitness seviyesi yeterli',
                    experience: 'Önceden deneyim gerekmez',
                    equipment: 'Tüm ekipmanlar eğitim merkezi tarafından sağlanır'
                },
                medicalRequirements: [
                    'Kalp hastalığı bulunmamalı',
                    'Yüksek tansiyon kontrolsüz olmamalı',
                    'Ciddi kas-iskelet problemi olmamalı',
                    'Hamilelik durumunda doktor onayı gerekli'
                ],
                documents: [
                    'Nüfus cüzdanı fotokopisi',
                    'Sağlık raporu (6 aydan yeni)',
                    'Veli izni (18 yaş altı için)'
                ]
            },
            intermediateLevel: {
                title: 'Orta Seviye Eğitimler',
                requirements: {
                    age: 'Minimum 18 yaş',
                    experience: 'En az 6 ay düzenli tırmanış deneyimi',
                    certificate: 'Temel tırmanış sertifikası zorunlu',
                    fitness: 'İyi kondisyon seviyesi gerekli',
                    skills: 'Temel tırmanış becerilerinde yetkinlik'
                },
                prerequisites: [
                    'HÜDDOSK Temel Tırmanış Sertifikası',
                    'Minimum 50 tırmanış rotası tamamlamış',
                    'Bağımsız belaying yapabilme',
                    'Temel düğümleri bilme'
                ],
                assessment: 'Ön değerlendirme testi yapılır'
            },
            advancedLevel: {
                title: 'İleri Seviye Eğitimler',
                requirements: {
                    age: 'Minimum 21 yaş',
                    experience: 'En az 2 yıl aktif tırmanış deneyimi',
                    certificate: 'İleri tırmanış sertifikası gerekli',
                    fitness: 'Yüksek kondisyon seviyesi',
                    skills: 'Çok hatveli tırmanış deneyimi'
                },
                prerequisites: [
                    'HÜDDOSK İleri Tırmanış Sertifikası',
                    'Minimum 5 multi-pitch rota deneyimi',
                    'Outdoor tırmanış deneyimi',
                    'Kurtarma tekniklerinde temel bilgi'
                ],
                specialRequirements: [
                    'Dağcılık sigortası zorunlu',
                    'Acil durum iletişim bilgileri',
                    'Özel sağlık raporu gerekli'
                ]
            }
        };

        res.json({
            success: true,
            data: prerequisites
        });
    }

    // Üyelik için zorunlu eğitimler
    static getMembershipRequirements(req, res) {
        const membershipRequirements = {
            regularMember: {
                title: 'Düzenli Üye Gereksinimleri',
                mandatoryCourses: [
                    {
                        id: 1,
                        name: 'İlk Yardım ve Güvenlik Eğitimi',
                        duration: '1 Gün',
                        validity: '2 Yıl',
                        renewal: 'Her 2 yılda bir yenilenmeli',
                        description: 'Tüm üyeler için zorunlu temel güvenlik eğitimi'
                    },
                    {
                        id: 2,
                        name: 'Temel Tırmanış Eğitimi',
                        duration: '2 Gün',
                        validity: 'Kalıcı',
                        renewal: 'Yenileme gerekmez',
                        description: 'Topluluk faaliyetlerine katılım için gerekli'
                    }
                ],
                timeframe: 'Üyelik başvurusundan sonra 3 ay içinde tamamlanmalı',
                benefits: [
                    'Tüm faaliyetlere katılım hakkı',
                    'Ekipman kiralama indirimi',
                    'Eğitim programlarında öncelikli kayıt',
                    'Topluluk etkinliklerine öncelikli katılım'
                ]
            },
            activeMember: {
                title: 'Aktif Üye Gereksinimleri',
                mandatoryCourses: [
                    {
                        id: 3,
                        name: 'İleri Tırmanış Teknikleri',
                        duration: '3 Gün',
                        validity: '3 Yıl',
                        renewal: 'İsteğe bağlı yenileme',
                        description: 'Liderlik rolü için gerekli'
                    },
                    {
                        id: 4,
                        name: 'Risk Yönetimi ve Liderlik',
                        duration: '2 Gün',
                        validity: '2 Yıl',
                        renewal: 'Her 2 yılda bir güncelleme',
                        description: 'Grup lideri olmak isteyenler için'
                    }
                ],
                responsibilities: [
                    'Yeni üyelere mentorluk',
                    'Faaliyet liderliği',
                    'Güvenlik prosedürlerine uyum',
                    'Topluluk kurallarına örnek olma'
                ],
                benefits: [
                    'Faaliyet planlama yetkisi',
                    'Eğitim asistanlığı fırsatı',
                    'Ücretsiz ekipman kullanımı',
                    'Uluslararası etkinliklere katılım'
                ]
            },
            instructorMember: {
                title: 'Eğitmen Üye Gereksinimleri',
                mandatoryCourses: [
                    {
                        id: 5,
                        name: 'Eğitmenlik Kursu',
                        duration: '5 Gün',
                        validity: '5 Yıl',
                        renewal: 'Her 5 yılda sertifikasyon yenileme',
                        description: 'Eğitmen olmak için zorunlu'
                    },
                    {
                        id: 6,
                        name: 'Pedagoji ve İletişim',
                        duration: '2 Gün',
                        validity: 'Kalıcı',
                        renewal: 'İsteğe bağlı güncelleme',
                        description: 'Etkili eğitim verme teknikleri'
                    }
                ],
                qualifications: [
                    'Minimum 5 yıl tırmanış deneyimi',
                    'UIAA sertifikası (tercih edilir)',
                    'Eğitim verme deneyimi',
                    'İletişim becerileri'
                ],
                responsibilities: [
                    'Eğitim programlarını yürütmek',
                    'Güvenlik standartlarını korumak',
                    'Yeni eğitim materyalleri geliştirmek',
                    'Kalite kontrol yapmak'
                ],
                compensation: 'Gönüllülük esasına dayalı + yıllık takdir belgesi'
            }
        };

        res.json({
            success: true,
            data: membershipRequirements
        });
    }

    // Tüm eğitim programlarını getir (eski API uyumluluğu için)
    static getAllPrograms(req, res) {
        // Yeni yapıyla uyumlu hale getir
        this.getOurPrograms(req, res);
    }

    // Özel atölyeleri getir
    static getWorkshops(req, res) {
        const workshops = [
            {
                id: 5,
                title: 'Doğa Fotoğrafçılığı',
                category: 'Sanat',
                duration: '2 Gün',
                capacity: 15,
                description: 'Doğa sporları sırasında profesyonel fotoğraf çekme teknikleri.',
                topics: [
                    'Kamera kullanımı',
                    'Kompozisyon teknikleri',
                    'Doğal ışık kullanımı',
                    'Aksiyon fotoğrafçılığı'
                ],
                certificate: false,
                equipment: 'Kendi kameranızı getirin',
                instructor: 'Elif Yılmaz',
                nextDate: '2024-12-12',
                registrationDeadline: '2024-12-08',
                availableSpots: 7
            }
        ];

        res.json({
            success: true,
            data: workshops,
            total: workshops.length
        });
    }

    // Belirli bir programı getir
    static getProgramById(req, res) {
        const { id } = req.params;
        
        // Örnek program detayı
        const program = {
            id: parseInt(id),
            title: 'Temel Tırmanış Eğitimi',
            level: 'Başlangıç',
            duration: '2 Gün',
            capacity: 15,
            description: 'Tırmanışa yeni başlayanlar için temel bilgiler, ekipman tanıtımı ve güvenlik kuralları.',
            detailedDescription: `Bu eğitim programı, tırmanış sporuna yeni başlayanlar için tasarlanmıştır. 
                                2 gün süren kapsamlı eğitimde, tırmanışın temel prensipleri, güvenlik kuralları 
                                ve ekipman kullanımı öğretilir. Teorik bilgilerin yanı sıra bol miktarda pratik 
                                uygulama yapılır.`,
            schedule: {
                day1: [
                    '09:00 - Karşılama ve tanışma',
                    '09:30 - Tırmanış sporuna giriş',
                    '10:30 - Ekipman tanıtımı',
                    '12:00 - Öğle arası',
                    '13:00 - Düğüm teknikleri',
                    '15:00 - Pratik uygulamalar',
                    '17:00 - Gün sonu değerlendirme'
                ],
                day2: [
                    '09:00 - Güvenlik prosedürleri',
                    '10:30 - Belaying teknikleri',
                    '12:00 - Öğle arası',
                    '13:00 - Duvar tırmanışı pratiği',
                    '15:30 - İleri tekniklere giriş',
                    '16:30 - Sertifika töreni'
                ]
            },
            topics: [
                'Temel güvenlik kuralları',
                'Ekipman tanıtımı',
                'Düğüm teknikleri',
                'Pratik uygulamalar'
            ],
            includedEquipment: [
                'Kask',
                'Emniyet kemeri',
                'Tırmanış ayakkabısı',
                'Chalk bag',
                'Eğitim materyalleri'
            ],
            prerequisites: 'Herhangi bir deneyim gerekmez',
            ageLimit: '16 yaş ve üzeri',
            certificate: true,
            instructor: {
                name: 'Ahmet Kaya',
                title: 'Baş Eğitmen',
                experience: '15 yıl',
                certifications: ['UIAA', 'IFMGA']
            },
            nextDate: '2024-12-15',
            registrationDeadline: '2024-12-10',
            availableSpots: 8,
            totalSpots: 15,
            location: 'HÜDDOSK Eğitim Merkezi',
            cancellationPolicy: 'Eğitimden 48 saat öncesine kadar iptal edilebilir.'
        };

        if (!program) {
            return res.status(404).json({
                success: false,
                message: 'Eğitim programı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: program
        });
    }

    // Eğitim programına kayıt ol
    static registerForProgram(req, res) {
        const { id } = req.params;
        const { name, email, phone, experience, notes } = req.body;

        // Validasyon
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Ad, e-posta ve telefon alanları zorunludur'
            });
        }

        // Burada gerçek kayıt işlemi yapılacak (database'e kaydetme vs.)
        const registration = {
            id: Date.now(), // Gerçek uygulamada UUID kullanılmalı
            programId: parseInt(id),
            participant: {
                name,
                email,
                phone,
                experience: experience || 'Yok',
                notes: notes || ''
            },
            registrationDate: new Date(),
            status: 'confirmed'
        };

        res.status(201).json({
            success: true,
            message: 'Kayıt başarıyla tamamlandı',
            data: registration
        });
    }

    // Eğitim seviyelerine göre programları getir
    static getProgramsByLevel(req, res) {
        const { level } = req.params;
        
        // Filtrelenmiş programlar burada döndürülecek
        const filteredPrograms = [];

        res.json({
            success: true,
            data: filteredPrograms,
            filter: level,
            total: filteredPrograms.length
        });
    }

    // Eğitim istatistikleri
    static getEducationStats(req, res) {
        const stats = {
            totalPrograms: 5,
            totalStudents: 500,
            totalCertificates: 450,
            averageRating: 4.8,
            upcomingPrograms: 3,
            activeInstructors: 4,
            completionRate: 95,
            monthlyEnrollments: [
                { month: 'Ocak', enrollments: 25 },
                { month: 'Şubat', enrollments: 30 },
                { month: 'Mart', enrollments: 28 },
                { month: 'Nisan', enrollments: 35 },
                { month: 'Mayıs', enrollments: 40 },
                { month: 'Haziran', enrollments: 45 }
            ]
        };

        res.json({
            success: true,
            data: stats
        });
    }

    // Yeni eğitim programı oluştur (Admin)
    static async createProgram(req, res) {
        try {
            const {
                title,
                description,
                difficulty_level,
                duration,
                location,
                instructor,
                start_date,
                end_date,
                topics,
                prerequisites,
                curriculum,
                status = 'active'
            } = req.body;

            if (!title || !location) {
                return res.status(400).json({
                    success: false,
                    message: 'Program adı ve yer alanları zorunludur'
                });
            }

            const connection = await pool.getConnection();
            
            const [result] = await connection.execute(
                `INSERT INTO education_programs 
                (title, description, difficulty_level, duration, location, instructor, start_date, end_date, prerequisites, curriculum, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    description || null,
                    difficulty_level || 'beginner',
                    duration || null,
                    location,
                    instructor || null,
                    start_date || null,
                    end_date || null,
                    prerequisites || null,
                    curriculum || null,
                    status
                ]
            );

            connection.release();

            res.status(201).json({
                success: true,
                message: 'Eğitim programı başarıyla oluşturuldu',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('Program creation error:', error);
            res.status(500).json({
                success: false,
                message: 'Eğitim programı oluşturulurken hata oluştu'
            });
        }
    }

    // Eğitim programını güncelle (Admin)
    static async updateProgram(req, res) {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                difficulty_level,
                duration,
                location,
                instructor,
                start_date,
                end_date,
                topics,
                prerequisites,
                curriculum,
                status
            } = req.body;

            if (!title || !location) {
                return res.status(400).json({
                    success: false,
                    message: 'Program adı ve yer alanları zorunludur'
                });
            }

            const connection = await pool.getConnection();
            
            // Programın var olup olmadığını kontrol et
            const [existing] = await connection.execute(
                'SELECT id FROM education_programs WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'Eğitim programı bulunamadı'
                });
            }

            await connection.execute(
                `UPDATE education_programs SET 
                title = ?, description = ?, difficulty_level = ?, duration = ?, 
                location = ?, instructor = ?, start_date = ?, end_date = ?, 
                prerequisites = ?, curriculum = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?`,
                [
                    title,
                    description || null,
                    difficulty_level || 'beginner',
                    duration || null,
                    location,
                    instructor || null,
                    start_date || null,
                    end_date || null,
                    prerequisites || null,
                    curriculum || null,
                    status || 'active',
                    id
                ]
            );

            connection.release();

            res.json({
                success: true,
                message: 'Eğitim programı başarıyla güncellendi'
            });

        } catch (error) {
            console.error('Program update error:', error);
            res.status(500).json({
                success: false,
                message: 'Eğitim programı güncellenirken hata oluştu'
            });
        }
    }

    // Eğitim programını sil (Admin)
    static async deleteProgram(req, res) {
        try {
            const { id } = req.params;

            const connection = await pool.getConnection();
            
            // Programın var olup olmadığını kontrol et
            const [existing] = await connection.execute(
                'SELECT id, title FROM education_programs WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'Eğitim programı bulunamadı'
                });
            }

            await connection.execute(
                'DELETE FROM education_programs WHERE id = ?',
                [id]
            );

            connection.release();

            res.json({
                success: true,
                message: `"${existing[0].title}" programı başarıyla silindi`
            });

        } catch (error) {
            console.error('Program deletion error:', error);
            res.status(500).json({
                success: false,
                message: 'Eğitim programı silinirken hata oluştu'
            });
        }
    }
}

module.exports = EducationController; 