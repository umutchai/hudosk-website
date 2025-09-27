require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Import database config
const { testConnection, createTables } = require('./config/database');

// Import routes
const routes = require('./routes/index');

// Trust proxy (Railway, production)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'hudosk-session-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS middleware (for API requests)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Use routes
app.use('/', routes);

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);
    
    if (req.url.startsWith('/api/')) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } else {
        res.status(500).sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        const connected = await testConnection();
        
        if (connected) {
            // Create tables if they don't exist
            await createTables();
            
            // Start server
            app.listen(PORT, () => {
                console.log(`
🏔️  HÜDDOSK Website Server Started
🚀 Server running on: http://localhost:${PORT}
📱 Environment: ${process.env.NODE_ENV || 'development'}
🔧 MVC Pattern: ✅ Enabled
📊 MySQL Database: ✅ Connected
📡 API Documentation: http://localhost:${PORT}/api
🌐 Website: http://localhost:${PORT}
🔐 Admin Panel: http://localhost:${PORT}/admin

Available Endpoints:
📊 Statistics: http://localhost:${PORT}/api/stats
🏃 Activities: http://localhost:${PORT}/api/activities
🎓 Education: http://localhost:${PORT}/api/education/programs
👥 Team: http://localhost:${PORT}/api/about/team
🔐 Admin Login: http://localhost:${PORT}/admin/login
📈 Admin Dashboard: http://localhost:${PORT}/admin/dashboard
                `);
            });
        } else {
            console.error('❌ Veritabanı bağlantısı kurulamadı. Sunucu başlatılamıyor.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Sunucu başlatılırken hata:', error);
        process.exit(1);
    }
}

// Start the server
startServer(); 
