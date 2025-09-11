const path = require('path');
const { pool } = require('../config/database');

class ActivityController {
    // Faaliyet raporları sayfası
    static index(req, res) {
        try {
            res.sendFile(path.join(__dirname, '../public', 'faaliyet-raporlari.html'));
        } catch (error) {
            console.error('Faaliyet raporları sayfası yüklenirken hata:', error);
            res.status(500).send('Sunucu hatası');
        }
    }

    // Tüm faaliyetleri getir (API)
    static async getAllActivities(req, res) {
        try {
            const { limit, offset, type, search } = req.query;
            
            let query = 'SELECT * FROM activities';
            let params = [];
            let whereConditions = [];

            // Type filtresi (yeni tabloda type kolonu yok, hepsi faaliyet raporu)
            // if (type && type !== 'all') {
            //     whereConditions.push('type = ?');
            //     params.push(type);
            // }

            // Arama filtresi (yeni kolon isimleri)
            if (search) {
                whereConditions.push('(title LIKE ? OR report_description LIKE ? OR region LIKE ?)');
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            // WHERE koşullarını ekle
            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }

            // Sıralama ekle (yeni kolon isimleri)
            query += ' ORDER BY created_at DESC, activity_date DESC';

            // Limit ve offset ekle
            if (limit) {
                query += ' LIMIT ?';
                params.push(parseInt(limit));
                
                if (offset) {
                    query += ' OFFSET ?';
                    params.push(parseInt(offset));
                }
            }

            const connection = await pool.getConnection();
            const [activities] = await connection.execute(query, params);
            
            // Toplam sayı için ayrı sorgu
            let countQuery = 'SELECT COUNT(*) as total FROM activities';
            let countParams = [];
            
            if (whereConditions.length > 0) {
                countQuery += ' WHERE ' + whereConditions.join(' AND ');
                countParams = params.slice(0, whereConditions.length * (search ? 3 : 1));
            }
            
            const [countResult] = await connection.execute(countQuery, countParams);
            const totalCount = countResult[0].total;
            
            connection.release();

            // JSON alanları parse et - hem array hem de tek dosya adı formatını destekle
            const parsePhotoField = (fieldData) => {
                if (!fieldData) return [];
                
                try {
                    const parsed = JSON.parse(fieldData);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    } else {
                        return [fieldData];
                    }
                } catch (e) {
                    return [fieldData];
                }
            };

            const formattedActivities = activities.map(activity => ({
                ...activity,
                cover_photo: activity.cover_photo,
                report_photos: parsePhotoField(activity.report_photos),
                pre_activity_photos: parsePhotoField(activity.pre_activity_photos),
                opinion_photos: parsePhotoField(activity.opinion_photos)
            }));

            res.json({
                success: true,
                data: formattedActivities,
                total: totalCount,
                returned: formattedActivities.length,
                pagination: {
                    limit: limit ? parseInt(limit) : null,
                    offset: offset ? parseInt(offset) : 0,
                    hasMore: formattedActivities.length === parseInt(limit || 0)
                }
            });
        } catch (error) {
            console.error('Activities fetch error:', error);
            res.status(500).json({
                success: false,
                message: 'Faaliyetler yüklenirken hata oluştu'
            });
        }
    }

    // Belirli bir faaliyeti getir
    static async getActivityById(req, res) {
        try {
            const { id } = req.params;
            console.log('🔍 getActivityById çağrıldı - ID:', id);
            
            const connection = await pool.getConnection();
            const [activities] = await connection.execute(
                'SELECT * FROM activities WHERE id = ?',
                [id]
            );
            connection.release();

            console.log('🔍 Veritabanından dönen kayıt sayısı:', activities.length);

            if (activities.length === 0) {
                console.log('❌ Faaliyet bulunamadı - ID:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Faaliyet bulunamadı'
                });
            }

            const activity = activities[0];
            console.log('✅ Faaliyet bulundu:', activity.title);
            console.log('🔍 Raw activity data:', activity);
            
            // JSON alanları parse et - hem array hem de tek dosya adı formatını destekle
            const parsePhotoField = (fieldData) => {
                if (!fieldData) return [];
                
                try {
                    // Önce JSON array olarak parse etmeyi dene
                    const parsed = JSON.parse(fieldData);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    } else {
                        // Array değilse, tek dosya adı olarak kabul et
                        return [fieldData];
                    }
                } catch (e) {
                    // JSON parse hatası varsa, tek dosya adı olarak kabul et
                    console.log('⚠️ JSON parse hatası, tek dosya adı olarak işleniyor:', e.message);
                    return [fieldData];
                }
            };

            const formattedActivity = {
                ...activity,
                cover_photo: activity.cover_photo,
                report_photos: parsePhotoField(activity.report_photos),
                pre_activity_photos: parsePhotoField(activity.pre_activity_photos),
                opinion_photos: parsePhotoField(activity.opinion_photos)
            };

            console.log('🔍 Parsed photo fields:', {
                report_photos: formattedActivity.report_photos,
                pre_activity_photos: formattedActivity.pre_activity_photos,
                opinion_photos: formattedActivity.opinion_photos
            });

            console.log('✅ Formatted activity gönderiliyor');
            console.log('✅ Final formatted activity:', formattedActivity);
            res.json({
                success: true,
                data: formattedActivity
            });
        } catch (error) {
            console.error('❌ Activity fetch error:', error);
            res.status(500).json({
                success: false,
                message: 'Faaliyet yüklenirken hata oluştu'
            });
        }
    }

    // Faaliyetleri filtrele
    static async getActivitiesByType(req, res) {
        try {
            const { type } = req.params;
            
            const connection = await pool.getConnection();
            const [activities] = await connection.execute(
                'SELECT * FROM activities WHERE type = ? ORDER BY date_start DESC',
                [type]
            );
            connection.release();

            // JSON alanları parse et - hem array hem de tek dosya adı formatını destekle
            const parsePhotoField = (fieldData) => {
                if (!fieldData) return [];
                
                try {
                    const parsed = JSON.parse(fieldData);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    } else {
                        return [fieldData];
                    }
                } catch (e) {
                    return [fieldData];
                }
            };

            const formattedActivities = activities.map(activity => ({
                ...activity,
                cover_photo: activity.cover_photo,
                report_photos: parsePhotoField(activity.report_photos),
                pre_activity_photos: parsePhotoField(activity.pre_activity_photos),
                opinion_photos: parsePhotoField(activity.opinion_photos)
            }));

            res.json({
                success: true,
                data: formattedActivities,
                filter: type,
                total: formattedActivities.length
            });
        } catch (error) {
            console.error('Activities filter error:', error);
            res.status(500).json({
                success: false,
                message: 'Filtrelenmiş faaliyetler yüklenirken hata oluştu'
            });
        }
    }

    // Yaklaşan faaliyetler
    static async getUpcomingActivities(req, res) {
        try {
            const connection = await pool.getConnection();
            const [activities] = await connection.execute(
                'SELECT * FROM activities WHERE date_start > CURDATE() AND status = "active" ORDER BY date_start ASC'
            );
            connection.release();

            // JSON alanları parse et - hem array hem de tek dosya adı formatını destekle
            const parsePhotoField = (fieldData) => {
                if (!fieldData) return [];
                
                try {
                    const parsed = JSON.parse(fieldData);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    } else {
                        return [fieldData];
                    }
                } catch (e) {
                    return [fieldData];
                }
            };

            const formattedActivities = activities.map(activity => ({
                ...activity,
                cover_photo: activity.cover_photo,
                report_photos: parsePhotoField(activity.report_photos),
                pre_activity_photos: parsePhotoField(activity.pre_activity_photos),
                opinion_photos: parsePhotoField(activity.opinion_photos)
            }));

            res.json({
                success: true,
                data: formattedActivities,
                total: formattedActivities.length
            });
        } catch (error) {
            console.error('Upcoming activities error:', error);
            res.status(500).json({
                success: false,
                message: 'Yaklaşan faaliyetler yüklenirken hata oluştu'
            });
        }
    }

    // Admin: Yeni faaliyet oluştur
    static async createActivity(req, res) {
        try {
            console.log('🔍 Create Activity - Request received');
            console.log('🔍 Request body:', req.body);
            console.log('🔍 Request files:', req.files);
            console.log('🔍 Request session:', req.session);
            
            const {
                title,
                activity_date,
                region,
                route,
                team,
                technical_equipment,
                weather_conditions,
                report_writer,
                pre_activity_description,
                report_description,
                opinions
            } = req.body;

            console.log('🔍 Validation check - title:', title, 'activity_date:', activity_date);
            
            if (!title || !activity_date) {
                console.log('❌ Validation failed - missing required fields');
                return res.status(400).json({
                    success: false,
                    message: 'Faaliyet başlığı ve tarihi gerekli'
                });
            }

            // Dosya upload alanlarını doğru şekilde grupla
            let coverPhoto = null;
            let preActivityPhotos = [];
            let reportPhotos = [];
            let opinionPhotos = [];

            console.log('🔍 Files object:', req.files);
            console.log('🔍 Files keys:', Object.keys(req.files || {}));

            if (req.files) {
                if (req.files.cover_photo) {
                    console.log('📸 Processing cover_photo:', req.files.cover_photo);
                    coverPhoto = req.files.cover_photo[0].filename;
                    console.log('📸 Added to cover_photo:', coverPhoto);
                }
                if (req.files.pre_activity_photos) {
                    console.log('📸 Processing pre_activity_photos:', req.files.pre_activity_photos);
                    req.files.pre_activity_photos.forEach(file => {
                        preActivityPhotos.push(file.filename);
                        console.log('📸 Added to pre_activity_photos:', file.filename);
                    });
                }
                if (req.files.report_photos) {
                    console.log('📸 Processing report_photos:', req.files.report_photos);
                    req.files.report_photos.forEach(file => {
                        reportPhotos.push(file.filename);
                        console.log('📸 Added to report_photos:', file.filename);
                    });
                }

                if (req.files.opinion_photos) {
                    console.log('📸 Processing opinion_photos:', req.files.opinion_photos);
                    req.files.opinion_photos.forEach(file => {
                        opinionPhotos.push(file.filename);
                        console.log('📸 Added to opinion_photos:', file.filename);
                    });
                }
            }

            console.log('📸 Final photo arrays:', {
                coverPhoto,
                preActivityPhotos,
                reportPhotos,
                opinionPhotos
            });

            console.log('🔍 Database insertion starting...');
            console.log('🔍 Insert values:', {
                title, activity_date, region, route, team, technical_equipment,
                weather_conditions, report_writer, pre_activity_description,
                report_description, opinions
            });
            
            const connection = await pool.getConnection();
            const [result] = await connection.execute(
                `INSERT INTO activities 
                (title, cover_photo, activity_date, region, route, team, technical_equipment, weather_conditions, 
                 report_writer, pre_activity_description, pre_activity_photos, 
                 report_description, report_photos, opinions, opinion_photos) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    coverPhoto,
                    activity_date,
                    region,
                    route,
                    team,
                    technical_equipment,
                    weather_conditions,
                    report_writer,
                    pre_activity_description,
                    preActivityPhotos.length > 0 ? JSON.stringify(preActivityPhotos) : null,
                    report_description,
                    reportPhotos.length > 0 ? JSON.stringify(reportPhotos) : null,
                    opinions,
                    opinionPhotos.length > 0 ? JSON.stringify(opinionPhotos) : null
                ]
            );
            connection.release();
            
            console.log('✅ Database insertion successful, ID:', result.insertId);
            console.log('✅ Photo arrays saved:', {
                coverPhoto,
                preActivityPhotos: preActivityPhotos.length > 0 ? JSON.stringify(preActivityPhotos) : null,
                reportPhotos: reportPhotos.length > 0 ? JSON.stringify(reportPhotos) : null,
                opinionPhotos: opinionPhotos.length > 0 ? JSON.stringify(opinionPhotos) : null
            });

            res.json({
                success: true,
                message: 'Faaliyet raporu başarıyla oluşturuldu',
                data: { id: result.insertId }
            });

        } catch (error) {
            console.error('❌ Create activity error:', error);
            console.error('❌ Error stack:', error.stack);
            console.error('❌ Error message:', error.message);
            res.status(500).json({
                success: false,
                message: 'Faaliyet raporu oluşturulurken hata oluştu',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Admin: Faaliyet güncelle
    static async updateActivity(req, res) {
        try {
            const { id } = req.params;
            const {
                title,
                activity_date,
                region,
                route,
                team,
                technical_equipment,
                weather_conditions,
                report_writer,
                pre_activity_description,
                report_description,
                opinions
            } = req.body;

            const connection = await pool.getConnection();
            
            // Mevcut faaliyet kontrolü
            const [existing] = await connection.execute(
                'SELECT id FROM activities WHERE id = ?',
                [id]
            );

            if (existing.length === 0) {
                connection.release();
                return res.status(404).json({
                    success: false,
                    message: 'Faaliyet bulunamadı'
                });
            }

            // Dosya upload alanlarını doğru şekilde grupla
            let coverPhoto = null;
            let preActivityPhotos = [];
            let reportPhotos = [];
            let opinionPhotos = [];

            console.log('🔍 Files object:', req.files);
            console.log('🔍 Files keys:', Object.keys(req.files || {}));

            if (req.files) {
                if (req.files.cover_photo) {
                    console.log('📸 Processing cover_photo:', req.files.cover_photo);
                    coverPhoto = req.files.cover_photo[0].filename;
                    console.log('📸 Added to cover_photo:', coverPhoto);
                }
                if (req.files.pre_activity_photos) {
                    console.log('📸 Processing pre_activity_photos:', req.files.pre_activity_photos);
                    req.files.pre_activity_photos.forEach(file => {
                        preActivityPhotos.push(file.filename);
                        console.log('📸 Added to pre_activity_photos:', file.filename);
                    });
                }
                if (req.files.report_photos) {
                    console.log('📸 Processing report_photos:', req.files.report_photos);
                    req.files.report_photos.forEach(file => {
                        reportPhotos.push(file.filename);
                        console.log('📸 Added to report_photos:', file.filename);
                    });
                }

                if (req.files.opinion_photos) {
                    console.log('📸 Processing opinion_photos:', req.files.opinion_photos);
                    req.files.opinion_photos.forEach(file => {
                        opinionPhotos.push(file.filename);
                        console.log('📸 Added to opinion_photos:', file.filename);
                    });
                }
            }

            console.log('📸 Final photo arrays:', {
                coverPhoto,
                preActivityPhotos,
                reportPhotos,
                opinionPhotos
            });

            await connection.execute(
                `UPDATE activities SET 
                title = ?, cover_photo = ?, activity_date = ?, region = ?, route = ?, team = ?, 
                technical_equipment = ?, weather_conditions = ?, report_writer = ?,
                pre_activity_description = ?, pre_activity_photos = ?,
                report_description = ?, report_photos = ?, opinions = ?, opinion_photos = ?
                WHERE id = ?`,
                [
                    title,
                    coverPhoto,
                    activity_date,
                    region,
                    route,
                    team,
                    technical_equipment,
                    weather_conditions,
                    report_writer,
                    pre_activity_description,
                    preActivityPhotos.length > 0 ? JSON.stringify(preActivityPhotos) : null,
                    report_description,
                    reportPhotos.length > 0 ? JSON.stringify(reportPhotos) : null,
                    opinions,
                    opinionPhotos.length > 0 ? JSON.stringify(opinionPhotos) : null,
                    id
                ]
            );
            connection.release();

            res.json({
                success: true,
                message: 'Faaliyet raporu başarıyla güncellendi'
            });

        } catch (error) {
            console.error('Update activity error:', error);
            res.status(500).json({
                success: false,
                message: 'Faaliyet raporu güncellenirken hata oluştu'
            });
        }
    }

    // Admin: Faaliyet sil
    static async deleteActivity(req, res) {
        try {
            const { id } = req.params;

            const connection = await pool.getConnection();
            const [result] = await connection.execute(
                'DELETE FROM activities WHERE id = ?',
                [id]
            );
            connection.release();

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Faaliyet bulunamadı'
                });
            }

            res.json({
                success: true,
                message: 'Faaliyet başarıyla silindi'
            });

        } catch (error) {
            console.error('Delete activity error:', error);
            res.status(500).json({
                success: false,
                message: 'Faaliyet silinirken hata oluştu'
            });
        }
    }
}

module.exports = ActivityController; 