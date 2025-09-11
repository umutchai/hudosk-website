const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'hudosk-secret-key-2024';

// JWT token oluştur
function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            email: user.email, 
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Token doğrula
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Authentication middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Erişim token\'ı gerekli'
        });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Geçersiz token'
            });
        }

        // Kullanıcının hala aktif olup olmadığını kontrol et
        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [decoded.id]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
}

// Admin authorization middleware
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin yetkisi gerekli'
        });
    }
    next();
}

// Editor veya Admin authorization middleware
function requireEditor(req, res, next) {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
        return res.status(403).json({
            success: false,
            message: 'Editor veya Admin yetkisi gerekli'
        });
    }
    next();
}

// Session tabanlı auth (admin paneli sayfaları için)
function requireAuth(req, res, next) {
    // Debug için session bilgisini logla
    console.log('🔐 Auth Check - URL:', req.url);
    console.log('🔐 Auth Check - Method:', req.method);
    console.log('🔐 Auth Check - Session exists:', !!req.session);
    console.log('🔐 Auth Check - User in session:', !!req.session?.user);
    console.log('🔐 Auth Check - Session data:', req.session);
    
    if (req.session && req.session.user) {
        console.log('✅ Auth Check - PASSED for user:', req.session.user.username);
        // API endpoint'leri için user bilgisini req.user'a ekle
        req.user = req.session.user;
        return next();
    } else {
        console.log('❌ Auth Check - FAILED, redirecting to login');
        
        // API endpoint'leri için JSON response döndür
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({
                success: false,
                message: 'Oturum açmanız gerekli'
            });
        }
        
        // Admin paneli sayfası ise login sayfasına yönlendir
        if (req.path.startsWith('/admin') && req.path !== '/admin/login') {
            return res.redirect('/admin/login');
        }
        
        return res.status(401).json({
            success: false,
            message: 'Oturum açmanız gerekli'
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    requireAdmin,
    requireEditor,
    requireAuth
}; 