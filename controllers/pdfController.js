const { pool } = require('../config/database');

exports.downloadEducationProgramsPDF = async (req, res) => {
    try {
        console.log('HTML rapor indirme isteği alındı');
        
        // Eğitim programlarını veritabanından al
        const [programs] = await pool.query(`
            SELECT * FROM education_programs 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        `);
        
        console.log(`${programs.length} aktif eğitim programı bulundu`);
        
        if (programs.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'İndirilecek aktif eğitim programı bulunamadı' 
            });
        }

        // HTML içeriği oluştur
        const htmlContent = generateEducationProgramsHTML(programs);
        
        console.log('HTML içeriği oluşturuldu, uzunluk:', htmlContent.length);
        
        // HTML dosyası olarak indir
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="egitim_programlari.html"');
        res.setHeader('Content-Length', Buffer.byteLength(htmlContent, 'utf8'));
        res.send(htmlContent);
        
        console.log('HTML rapor başarıyla indirildi');
        
    } catch (error) {
        console.error('HTML rapor oluşturma hatası:', error);
        
        res.status(500).json({ 
            success: false, 
            message: 'HTML rapor oluşturulurken hata oluştu: ' + error.message 
        });
    }
};

function generateEducationProgramsHTML(programs) {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HÜDDOSK Eğitim Programları</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: white;
                color: #333;
                font-size: 14px;
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #2c3e50;
                padding-bottom: 20px;
            }
            .header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #7f8c8d;
                margin: 5px 0 0 0;
                font-size: 16px;
            }
            .program {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .program h3 {
                color: #2c3e50;
                margin: 0 0 15px 0;
                font-size: 20px;
                border-bottom: 1px solid #3498db;
                padding-bottom: 8px;
            }
            .program-info {
                margin-bottom: 15px;
            }
            .program-info p {
                margin: 8px 0;
                font-size: 14px;
            }
            .program-info strong {
                color: #2c3e50;
            }
            .curriculum, .prerequisites {
                margin-top: 15px;
            }
            .curriculum h4, .prerequisites h4 {
                color: #2c3e50;
                margin: 0 0 8px 0;
                font-size: 16px;
            }
            .curriculum ul, .prerequisites ul {
                margin: 8px 0;
                padding-left: 25px;
            }
            .curriculum li, .prerequisites li {
                margin: 4px 0;
                font-size: 14px;
            }
            .status-active {
                color: #27ae60;
                font-weight: bold;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #7f8c8d;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            @media print {
                body {
                    padding: 0;
                    margin: 20mm;
                }
                .program {
                    page-break-inside: avoid;
                    margin-bottom: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>HÜDDOSK Eğitim Programları</h1>
            <p>Rapor Tarihi: ${currentDate}</p>
            <p>Toplam Program Sayısı: ${programs.length}</p>
        </div>
        
        ${programs.map((program, index) => {
            let curriculum = [];
            let prerequisites = [];
            
            try {
                curriculum = program.curriculum ? JSON.parse(program.curriculum) : [];
                if (!Array.isArray(curriculum)) curriculum = [curriculum];
            } catch (e) {
                curriculum = program.curriculum ? [program.curriculum] : [];
            }
            
            try {
                prerequisites = program.prerequisites ? JSON.parse(program.prerequisites) : [];
                if (!Array.isArray(prerequisites)) prerequisites = [prerequisites];
            } catch (e) {
                prerequisites = program.prerequisites ? [program.prerequisites] : [];
            }
            
            return `
                <div class="program">
                    <h3>${index + 1}. ${program.title}</h3>
                    <div class="program-info">
                        <p><strong>Açıklama:</strong> ${program.description || 'Açıklama bulunmuyor'}</p>
                        <p><strong>Süre:</strong> ${program.duration || 'Belirtilmemiş'}</p>
                        <p><strong>Seviye:</strong> ${program.level || 'Belirtilmemiş'}</p>
                        <p><strong>Durum:</strong> <span class="status-active">${program.status}</span></p>
                        <p><strong>Oluşturulma Tarihi:</strong> ${new Date(program.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    
                    ${curriculum.length > 0 ? `
                        <div class="curriculum">
                            <h4>Müfredat:</h4>
                            <ul>
                                ${curriculum.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${prerequisites.length > 0 ? `
                        <div class="prerequisites">
                            <h4>Ön Koşullar:</h4>
                            <ul>
                                ${prerequisites.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('')}
        
        <div class="footer">
            <p>Bu rapor HÜDDOSK eğitim yönetim sistemi tarafından otomatik olarak oluşturulmuştur.</p>
            <p>© ${new Date().getFullYear()} HÜDDOSK - Tüm hakları saklıdır.</p>
        </div>
    </body>
    </html>
    `;
} 