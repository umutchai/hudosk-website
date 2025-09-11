const { pool } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer konfigürasyonu - fotoğraf yükleme için
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/uploads/activity-photos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
    }
});

// Tüm faaliyet raporlarını getir
exports.getAllActivityReports = async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT * FROM activity_reports 
            WHERE status = 'active' 
            ORDER BY activity_date DESC, created_at DESC
        `);
        
        res.json({ success: true, data: reports });
    } catch (error) {
        console.error('Faaliyet raporları getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Faaliyet raporları getirilemedi' });
    }
};

// Tek bir faaliyet raporu getir
exports.getActivityReport = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [reports] = await pool.query(`
            SELECT * FROM activity_reports WHERE id = ? AND status = 'active'
        `, [id]);
        
        if (reports.length === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        res.json({ success: true, data: reports[0] });
    } catch (error) {
        console.error('Faaliyet raporu getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Faaliyet raporu getirilemedi' });
    }
};

// Yeni faaliyet raporu oluştur
exports.createActivityReport = async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            location,
            activity_date,
            duration,
            difficulty_level,
            participants_count,
            weather_conditions,
            equipment_used,
            route_description,
            challenges_faced,
            lessons_learned,
            recommendations
        } = req.body;
        
        // Fotoğrafları al
        const photos = req.files ? req.files.map(file => file.filename) : [];
        
        const [result] = await pool.query(`
            INSERT INTO activity_reports (
                title, description, content, location, activity_date, duration,
                difficulty_level, participants_count, weather_conditions,
                equipment_used, route_description, challenges_faced,
                lessons_learned, recommendations, photos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title, description, content, location, activity_date, duration,
            difficulty_level, participants_count, weather_conditions,
            equipment_used, route_description, challenges_faced,
            lessons_learned, recommendations, JSON.stringify(photos)
        ]);
        
        res.json({ 
            success: true, 
            message: 'Faaliyet raporu başarıyla oluşturuldu',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Faaliyet raporu oluşturma hatası:', error);
        res.status(500).json({ success: false, message: 'Faaliyet raporu oluşturulamadı' });
    }
};

// Faaliyet raporu güncelle
exports.updateActivityReport = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            content,
            location,
            activity_date,
            duration,
            difficulty_level,
            participants_count,
            weather_conditions,
            equipment_used,
            route_description,
            challenges_faced,
            lessons_learned,
            recommendations
        } = req.body;
        
        // Mevcut fotoğrafları al
        const [existingReport] = await pool.query(`
            SELECT photos FROM activity_reports WHERE id = ?
        `, [id]);
        
        if (existingReport.length === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        let currentPhotos = [];
        try {
            currentPhotos = JSON.parse(existingReport[0].photos || '[]');
        } catch (e) {
            currentPhotos = [];
        }
        
        // Yeni fotoğrafları ekle
        const newPhotos = req.files ? req.files.map(file => file.filename) : [];
        const allPhotos = [...currentPhotos, ...newPhotos];
        
        const [result] = await pool.query(`
            UPDATE activity_reports SET
                title = ?, description = ?, content = ?, location = ?, activity_date = ?,
                duration = ?, difficulty_level = ?, participants_count = ?,
                weather_conditions = ?, equipment_used = ?, route_description = ?,
                challenges_faced = ?, lessons_learned = ?, recommendations = ?,
                photos = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            title, description, content, location, activity_date, duration,
            difficulty_level, participants_count, weather_conditions,
            equipment_used, route_description, challenges_faced,
            lessons_learned, recommendations, JSON.stringify(allPhotos), id
        ]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        res.json({ success: true, message: 'Faaliyet raporu başarıyla güncellendi' });
    } catch (error) {
        console.error('Faaliyet raporu güncelleme hatası:', error);
        res.status(500).json({ success: false, message: 'Faaliyet raporu güncellenemedi' });
    }
};

// Faaliyet raporu sil
exports.deleteActivityReport = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Önce fotoğrafları al
        const [report] = await pool.query(`
            SELECT photos FROM activity_reports WHERE id = ?
        `, [id]);
        
        if (report.length === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        // Fotoğrafları sil
        try {
            const photos = JSON.parse(report[0].photos || '[]');
            photos.forEach(photo => {
                const photoPath = path.join(__dirname, '../public/uploads/activity-photos', photo);
                if (fs.existsSync(photoPath)) {
                    fs.unlinkSync(photoPath);
                }
            });
        } catch (e) {
            console.log('Fotoğraf silme hatası:', e);
        }
        
        // Raporu sil
        const [result] = await pool.query(`
            DELETE FROM activity_reports WHERE id = ?
        `, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        res.json({ success: true, message: 'Faaliyet raporu başarıyla silindi' });
    } catch (error) {
        console.error('Faaliyet raporu silme hatası:', error);
        res.status(500).json({ success: false, message: 'Faaliyet raporu silinemedi' });
    }
};

// Fotoğraf sil
exports.deletePhoto = async (req, res) => {
    try {
        const { id, photoName } = req.params;
        
        // Mevcut fotoğrafları al
        const [report] = await pool.query(`
            SELECT photos FROM activity_reports WHERE id = ?
        `, [id]);
        
        if (report.length === 0) {
            return res.status(404).json({ success: false, message: 'Faaliyet raporu bulunamadı' });
        }
        
        let photos = [];
        try {
            photos = JSON.parse(report[0].photos || '[]');
        } catch (e) {
            photos = [];
        }
        
        // Fotoğrafı listeden çıkar
        const updatedPhotos = photos.filter(photo => photo !== photoName);
        
        // Dosyayı sil
        const photoPath = path.join(__dirname, '../public/uploads/activity-photos', photoName);
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }
        
        // Veritabanını güncelle
        await pool.query(`
            UPDATE activity_reports SET photos = ? WHERE id = ?
        `, [JSON.stringify(updatedPhotos), id]);
        
        res.json({ success: true, message: 'Fotoğraf başarıyla silindi' });
    } catch (error) {
        console.error('Fotoğraf silme hatası:', error);
        res.status(500).json({ success: false, message: 'Fotoğraf silinemedi' });
    }
};

// TinyMCE için resim yükleme
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dosya yüklenmedi' 
            });
        }

        // Dosya türünü kontrol et
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Sadece resim dosyaları yüklenebilir' 
            });
        }

        // Dosya boyutunu kontrol et (5MB)
        if (req.file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dosya boyutu 5MB\'dan büyük olamaz' 
            });
        }

        const imageUrl = `/uploads/activity-photos/${req.file.filename}`;
        
        // CKEditor'ın beklediği response formatı
        res.json({
            url: imageUrl,
            uploaded: true
        });
    } catch (error) {
        console.error('Resim yükleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Resim yüklenirken hata oluştu' 
        });
    }
};

// Multer middleware'ini export et
exports.upload = upload; 