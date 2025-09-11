const bcrypt = require('bcryptjs');
const path = require('path');
const { pool } = require('../config/database');
const { generateToken } = require('../middleware/auth');

class AdminController {
    // Admin giriş sayfası
    static loginPage(req, res) {
        if (req.session && req.session.user) {
            return res.redirect('/admin/dashboard');
        }
        res.sendFile(path.join(__dirname, '../public/admin', 'login.html'));
    }

    // Admin login işlemi
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            console.log('Login attempt:', { username, hasPassword: !!password });

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Kullanıcı adı ve şifre gerekli'
                });
            }

            const connection = await pool.getConnection();
            const [users] = await connection.execute(
                'SELECT * FROM users WHERE username = ? OR email = ?',
                [username, username]
            );
            connection.release();

            console.log('Found users:', users.length);

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }

            const user = users[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);

            console.log('Password validation:', isPasswordValid);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Geçersiz şifre'
                });
            }

            // Session oluştur
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            console.log('Session created:', req.session.user);

            // Session'ı kaydet
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Session kaydedilemedi'
                    });
                }

                res.json({
                    success: true,
                    message: 'Giriş başarılı',
                    data: {
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Sunucu hatası'
            });
        }
    }

    // Admin logout
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Çıkış yapılırken hata oluştu'
                });
            }
            res.json({
                success: true,
                message: 'Başarıyla çıkış yapıldı'
            });
        });
    }

    // Admin dashboard
    static dashboard(req, res) {
        res.sendFile(path.join(__dirname, '../public/admin', 'dashboard.html'));
    }

    // Kullanıcı bilgilerini getir
    static getUserInfo(req, res) {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Oturum bulunamadı'
            });
        }

        res.json({
            success: true,
            user: req.session.user
        });
    }

    // Dashboard istatistikleri
    static async getDashboardStats(req, res) {
        try {
            const connection = await pool.getConnection();

            // Aktivite sayıları
            const [activities] = await connection.execute('SELECT COUNT(*) as total FROM activities');
            const [activeActivities] = await connection.execute('SELECT COUNT(*) as total FROM activities WHERE status = "active"');
            
            // Eğitim programı sayıları
            const [programs] = await connection.execute('SELECT COUNT(*) as total FROM education_programs');
            const [activePrograms] = await connection.execute('SELECT COUNT(*) as total FROM education_programs WHERE status = "active"');
            
            // Takım üyesi sayıları
            const [team] = await connection.execute('SELECT COUNT(*) as total FROM team_members WHERE status = "active"');
            
            // Mesaj sayıları
            const [messages] = await connection.execute('SELECT COUNT(*) as total FROM contact_messages');
            const [newMessages] = await connection.execute('SELECT COUNT(*) as total FROM contact_messages WHERE status = "new"');

            // Son aktiviteler
            const [recentActivities] = await connection.execute(
                'SELECT id, title, type, date_start, status FROM activities ORDER BY created_at DESC LIMIT 5'
            );

            // Son mesajlar
            const [recentMessages] = await connection.execute(
                'SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
            );

            connection.release();

            const stats = {
                activities: {
                    total: activities[0].total,
                    active: activeActivities[0].total
                },
                programs: {
                    total: programs[0].total,
                    active: activePrograms[0].total
                },
                team: {
                    total: team[0].total
                },
                messages: {
                    total: messages[0].total,
                    new: newMessages[0].total
                },
                recent: {
                    activities: recentActivities,
                    messages: recentMessages
                }
            };

            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            console.error('Dashboard stats error:', error);
            res.status(500).json({
                success: false,
                message: 'İstatistikler yüklenirken hata oluştu'
            });
        }
    }

    // Yeni admin kullanıcısı oluştur (ilk kurulum için)
    static async createFirstAdmin(req, res) {
        try {
            const connection = await pool.getConnection();
            
            // Zaten admin var mı kontrol et
            const [existingAdmins] = await connection.execute(
                'SELECT COUNT(*) as count FROM users WHERE role = "admin"'
            );

            if (existingAdmins[0].count > 0) {
                connection.release();
                return res.status(400).json({
                    success: false,
                    message: 'Admin kullanıcısı zaten mevcut'
                });
            }

            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                connection.release();
                return res.status(400).json({
                    success: false,
                    message: 'Tüm alanlar gerekli'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "admin")',
                [username, email, hashedPassword]
            );

            connection.release();

            res.json({
                success: true,
                message: 'Admin kullanıcısı başarıyla oluşturuldu'
            });

        } catch (error) {
            console.error('Create admin error:', error);
            res.status(500).json({
                success: false,
                message: 'Admin oluşturulurken hata oluştu'
            });
        }
    }
}

module.exports = AdminController; 