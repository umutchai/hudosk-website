# 🏔️ HÜDDOSK - Doğa Sporları ve Tırmanış Website

HÜDDOSK doğa sporları topluluğunun resmi web sitesi. Tırmanış raporları, eğitim programları ve topluluk bilgilerini içeren modern ve responsive bir web uygulaması.

## 🚀 Özellikler

- **Modern Tasarım**: Bootstrap 5 ile responsive ve mobile-friendly tasarım
- **Anasayfa**: Hero section ve özellik kartları ile etkileyici anasayfa
- **Faaliyet Raporları**: Gerçekleştirilen tırmanış faaliyetlerinin detaylı raporları
- **Açık Erişim Eğitim Programları**: Başlangıç, orta ve ileri seviye tırmanış eğitimleri - herkese açık
- **Biz Kimiz**: Topluluk hakkında bilgiler, ekip üyeleri ve istatistikler
- **Smooth Animations**: CSS ve JavaScript ile yumuşak geçişler ve animasyonlar
- **SEO Optimized**: Arama motorları için optimize edilmiş yapı

## 🛠️ Teknolojiler

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Styling**: Bootstrap 5, Font Awesome
- **Icons**: Font Awesome 6
- **Package Manager**: npm

## 📁 Proje Yapısı

```
HUDDOSK/
├── package.json
├── server.js
├── README.md
├── hudosk.jpg
├── controllers/
│   ├── homeController.js
│   ├── activityController.js
│   ├── educationController.js
│   └── aboutController.js
├── routes/
│   └── index.js
├── models/
│   └── Activity.js
└── public/
    ├── index.html
    ├── faaliyet-raporlari.html
    ├── egitim-programlari.html
    ├── biz-kimiz.html
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v14.0.0 veya üzeri)
- npm (v6.0.0 veya üzeri)

### Adımlar

1. **Projeyi klonlayın veya indirin**
   ```bash
   git clone <repository-url>
   cd HUDDOSK
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Sunucuyu başlatın**
   ```bash
   npm start
   ```
   
   Geliştirme modu için:
   ```bash
   npm run dev
   ```

4. **Tarayıcınızda açın**
   ```
   http://localhost:8080
   ```

## 📱 Sayfalar

- **Ana Sayfa** (`/`): Topluluk tanıtımı ve genel bilgiler
- **Faaliyet Raporları** (`/faaliyet-raporlari`): Tırmanış faaliyetleri ve raporları
- **Eğitim Programları** (`/egitim-programlari`): Açık erişim eğitim kursları ve atölyeler
- **Biz Kimiz** (`/biz-kimiz`): Topluluk hakkında ve ekip bilgileri

## 🎓 Eğitim Programları

**Tüm eğitimlerimiz herkese açıktır!** HÜDDOSK olarak doğa sporları eğitimlerini topluma hizmet etmek amacıyla açık erişim ile sunuyoruz.

### Eğitim Kategorileri:
- **Bizim Verdiğimiz Eğitimler**: 4 farklı seviyede comprehensive eğitim programları
- **Eğitimlerin Müfredatı**: Gün gün ve saat saat detaylı program içerikleri
- **Eğitim Ön Koşulları**: Katılım için gerekli şartlar ve kriterler
- **Üyelik İçin Zorunlu Olanlar**: Farklı üyelik seviyelerine göre gereksinimler

## 🛠️ MVC Yapısı

Proje Model-View-Controller (MVC) mimarisi ile geliştirilmiştir:

### Controllers
- `homeController.js`: Ana sayfa ve genel bilgiler
- `activityController.js`: Faaliyet yönetimi ve raporları
- `educationController.js`: Eğitim programları yönetimi
- `aboutController.js`: Hakkımızda ve iletişim bilgileri

### API Endpoints
- `GET /api/stats` - Genel istatistikler
- `GET /api/activities` - Faaliyet listesi
- `GET /api/education/our-programs` - Eğitim programları
- `GET /api/education/curriculum` - Eğitim müfredatı
- `GET /api/education/prerequisites` - Eğitim ön koşulları
- `GET /api/education/membership-requirements` - Üyelik gereksinimleri
- `GET /api/about/team` - Ekip bilgileri

## 🎨 Tasarım Özellikleri

- **Renk Paleti**:
  - Birincil Yeşil: `#198754`
  - İkincil Sarı: `#ffc107`
  - Koyu Arka Plan: `#212529`
  - Açık Arka Plan: `#f8f9fa`

- **Tipografi**: Segoe UI font ailesi
- **İkonlar**: Font Awesome 6
- **Responsive Breakpoints**: Bootstrap 5 standartları

## 🖼️ Medya

Site, ana sayfada `hudosk.jpg` fotoğrafını hero background olarak kullanmaktadır. Fotoğraf dosyası proje root dizininde bulunmalıdır.

## 🔧 Geliştirme

### CSS Özelleştirme
Özel stiller `public/css/style.css` dosyasında bulunmaktadır:
- CSS değişkenleri (custom properties)
- Hover efektleri ve animasyonlar
- Responsive tasarım kuralları
- Özel component stilleri

### JavaScript Özellikleri
`public/js/script.js` dosyasında:
- Smooth scrolling
- Navbar background değişimi
- Scroll to top butonu
- Element animasyonları
- Dynamic content loading

## 📊 Browser Desteği

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **E-posta**: info@hudosk.com
- **Telefon**: +90 555 123 45 67
- **Instagram**: @hudosk_official
- **Website**: https://hudosk.com

## 📝 Notlar

- Proje Bootstrap 5 kullanmaktadır
- Tüm eğitim programları herkese açıktır
- MVC mimarisi ile organize edilmiştir
- RESTful API endpoints mevcuttur
- CDN linkler kullanılmıştır (offline çalışma için local dosyalar gerekli)
- Production deployment için environment variables ve güvenlik düzenlemeleri gerekli

---

**HÜDDOSK** - Doğa Sporları ve Tırmanış Topluluğu 🏔️
*Eğitimlerimiz topluma hizmet amaçlı herkese açıktır* 🎓 