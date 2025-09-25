const express = require('express');
const path = require('path');
const router = express.Router();

// Controllers
const HomeController = require('../controllers/homeController');
const ActivityController = require('../controllers/activityController');
const ActivityReportsController = require('../controllers/activityReportsController');
const ActivityReportsPDFController = require('../controllers/activityReportsPDFController');
const EducationController = require('../controllers/educationController');
const AboutController = require('../controllers/aboutController');
const AdminController = require('../controllers/adminController');
const PDFController = require('../controllers/pdfController');

// Middleware
const upload = require('../middleware/upload');

// Middleware
const { authenticateToken, requireAdmin, requireEditor, requireAuth } = require('../middleware/auth');

// Home Routes
router.get('/', HomeController.index);
router.get('/api/stats', HomeController.getStats);
router.get('/api/about', HomeController.getAbout);

// Activity Routes
router.get('/faaliyet-raporlari', ActivityController.index);
router.get('/faaliyet-detay', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'faaliyet-detay.html'));
});
router.get('/api/activities', ActivityController.getAllActivities);
router.get('/api/activities/:id', ActivityController.getActivityById);
router.get('/api/activities/type/:type', ActivityController.getActivitiesByType);
router.get('/api/activities/upcoming', ActivityController.getUpcomingActivities);

// Admin Activity Routes (Require authentication)
router.post('/api/admin/activities', requireAuth, requireEditor, upload.fields([
    { name: 'cover_photo', maxCount: 1 },
    { name: 'pre_activity_photos', maxCount: 5 },
    { name: 'report_photos', maxCount: 5 },
    { name: 'opinion_photos', maxCount: 5 }
]), ActivityController.createActivity);
router.put('/api/admin/activities/:id', requireAuth, requireEditor, upload.fields([
    { name: 'cover_photo', maxCount: 1 },
    { name: 'pre_activity_photos', maxCount: 5 },
    { name: 'report_photos', maxCount: 5 },
    { name: 'opinion_photos', maxCount: 5 }
]), ActivityController.updateActivity);
router.delete('/api/admin/activities/:id', requireAuth, requireAdmin, ActivityController.deleteActivity);

// Activity Reports Routes
router.get('/api/activity-reports', ActivityReportsController.getAllActivityReports);
router.get('/api/activity-reports/:id', ActivityReportsController.getActivityReport);

// Admin Activity Reports Routes (Require authentication)
router.post('/api/admin/activity-reports', requireAuth, requireEditor, ActivityReportsController.upload.array('photos', 10), ActivityReportsController.createActivityReport);
router.put('/api/admin/activity-reports/:id', requireAuth, requireEditor, ActivityReportsController.upload.array('photos', 10), ActivityReportsController.updateActivityReport);
router.delete('/api/admin/activity-reports/:id', requireAuth, requireAdmin, ActivityReportsController.deleteActivityReport);
router.delete('/api/admin/activity-reports/:id/photos/:photoName', requireAuth, requireEditor, ActivityReportsController.deletePhoto);

// TinyMCE resim yükleme endpoint'i
router.post('/api/admin/upload-image', requireAuth, requireEditor, upload.single('file'), ActivityReportsController.uploadImage);

// Education Routes
router.get('/egitim-programlari', EducationController.index);
// API Routes (Database-based)
router.get('/api/education/programs', EducationController.getAllProgramsAPI);
router.get('/api/education/programs/:id', EducationController.getProgramByIdAPI);
// Static Routes (For fallback/legacy)
router.get('/api/education/our-programs', EducationController.getOurPrograms);
router.get('/api/education/curriculum', EducationController.getCurriculum);
router.get('/api/education/prerequisites', EducationController.getPrerequisites);
router.get('/api/education/membership-requirements', EducationController.getMembershipRequirements);
router.get('/api/education/workshops', EducationController.getWorkshops);
router.get('/api/education/programs/level/:level', EducationController.getProgramsByLevel);
router.get('/api/education/stats', EducationController.getEducationStats);
router.post('/api/education/programs/:id/register', EducationController.registerForProgram);

// Admin Education Routes (Require authentication)
router.get('/api/admin/education/programs', requireAuth, EducationController.getAdminPrograms);
router.post('/api/education/programs', requireAuth, requireEditor, EducationController.createProgram);
router.put('/api/education/programs/:id', requireAuth, requireEditor, EducationController.updateProgram);
router.delete('/api/education/programs/:id', requireAuth, requireAdmin, EducationController.deleteProgram);

// PDF Routes removed

// About/Tüzük Routes
router.get('/biz-kimiz', (req, res) => res.redirect(301, '/tuzuk'));
router.get('/hakkimizda', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'hakkimizda.html'));
});
router.get('/tuzuk', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'tuzuk.html'));
});
router.get('/api/about/team', AboutController.getTeamMembers);
router.get('/api/about/values', AboutController.getValues);
router.get('/api/about/stats', AboutController.getOrganizationStats);
router.get('/api/about/contact', AboutController.getContactInfo);
router.get('/api/about/history', AboutController.getHistory);
router.post('/api/about/contact', AboutController.submitContactForm);

// Admin Panel Routes
router.get('/admin', (req, res) => res.redirect('/admin/login'));
router.get('/admin/login', AdminController.loginPage);
router.post('/admin/login', AdminController.login);
router.post('/admin/logout', AdminController.logout);
router.get('/admin/dashboard', requireAuth, AdminController.dashboard);

// Admin API Routes
router.get('/api/admin/user-info', requireAuth, AdminController.getUserInfo);
router.get('/api/admin/dashboard/stats', requireAuth, AdminController.getDashboardStats);
router.post('/api/admin/setup', AdminController.createFirstAdmin);

// Admin Pages Routes (require session auth)
router.get('/admin/activities', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'activities.html'));
});

router.get('/admin/education-programs', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'education-programs.html'));
});

router.get('/admin/activity-reports', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'activity-reports.html'));
});

router.get('/admin/programs', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'programs.html'));
});

router.get('/admin/team', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'team.html'));
});

router.get('/admin/messages', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'messages.html'));
});

router.get('/admin/settings', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin', 'settings.html'));
});

// API Documentation Route
router.get('/api', (req, res) => {
    const apiDocumentation = {
        title: 'HÜDDOSK API Documentation',
        version: '2.0.0',
        description: 'HÜDDOSK Doğa Sporları ve Tırmanış Web Sitesi API\'si - MySQL Database Integrated',
        baseUrl: req.protocol + '://' + req.get('host'),
        authentication: {
            type: 'Bearer Token (JWT)',
            header: 'Authorization: Bearer <token>',
            loginEndpoint: '/admin/login'
        },
        endpoints: {
            home: {
                'GET /': 'Ana sayfa',
                'GET /api/stats': 'Site istatistikleri',
                'GET /api/about': 'Genel hakkında bilgileri'
            },
            activities: {
                'GET /faaliyet-raporlari': 'Faaliyet raporları sayfası',
                'GET /api/activities': 'Tüm faaliyetler (MySQL)',
                'GET /api/activities/:id': 'Belirli faaliyet detayı (MySQL)',
                'GET /api/activities/type/:type': 'Türe göre faaliyetler (MySQL)',
                'GET /api/activities/upcoming': 'Yaklaşan faaliyetler (MySQL)',
                'POST /api/admin/activities': '🔐 Yeni faaliyet oluştur',
                'PUT /api/admin/activities/:id': '🔐 Faaliyet güncelle',
                'DELETE /api/admin/activities/:id': '🔐 Faaliyet sil (Admin Only)'
            },
            education: {
                'GET /egitim-programlari': 'Eğitim programları sayfası',
                'GET /api/education/programs': 'Tüm eğitim programları',
                'GET /api/education/our-programs': 'Özel programlar',
                'GET /api/education/curriculum': 'Kurikulum',
                'GET /api/education/prerequisites': 'Ön koşullar',
                'GET /api/education/membership-requirements': 'Üye koşulları',
                'GET /api/education/programs/:id': 'Belirli program detayı',
                'GET /api/education/workshops': 'Özel atölyeler',
                'GET /api/education/programs/level/:level': 'Seviyeye göre programlar',
                'GET /api/education/stats': 'Eğitim istatistikleri',
                'POST /api/education/programs/:id/register': 'Programa kayıt ol'
            },
            about: {
                'GET /tuzuk': 'Tüzük sayfası',
                'GET /api/about/team': 'Ekip üyeleri',
                'GET /api/about/values': 'Topluluk değerleri',
                'GET /api/about/stats': 'Organizasyon istatistikleri',
                'GET /api/about/contact': 'İletişim bilgileri',
                'GET /api/about/history': 'Topluluk tarihi',
                'POST /api/about/contact': 'İletişim formu gönder'
            },
            admin: {
                'GET /admin/login': 'Admin giriş sayfası',
                'POST /admin/login': 'Admin giriş işlemi',
                'POST /admin/logout': 'Admin çıkış işlemi',
                'GET /admin/dashboard': '🔐 Admin dashboard',
                'GET /api/admin/dashboard/stats': '🔐 Dashboard istatistikleri',
                'POST /api/admin/setup': 'İlk admin kullanıcısı oluştur'
            }
        },
        responseFormat: {
            success: {
                success: true,
                data: 'object or array',
                total: 'number (for arrays)'
            },
            error: {
                success: false,
                message: 'error message',
                code: 'error code (optional)'
            }
        },
        database: {
            type: 'MySQL',
            name: 'Huddosk',
            tables: ['users', 'activities', 'education_programs', 'team_members', 'site_settings', 'contact_messages']
        }
    };

    res.json(apiDocumentation);
});

// 404 Handler for API routes
router.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint bulunamadı',
        availableEndpoints: '/api'
    });
});

// Catch all other routes
router.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = router; 