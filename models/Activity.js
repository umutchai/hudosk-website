class Activity {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.type = data.type;
        this.date = data.date;
        this.duration = data.duration;
        this.participants = data.participants;
        this.description = data.description;
        this.difficulty = data.difficulty;
        this.location = data.location;
        this.coordinator = data.coordinator;
        this.photos = data.photos || [];
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    // Static method to get all activities
    static getAll() {
        // Bu metod ileride database'den veri çekecek
        return [
            new Activity({
                id: 1,
                title: 'Aladağlar Tırmanış Kampı',
                type: 'Tırmanış',
                date: '2024-11-15',
                duration: '3 Gün',
                participants: 12,
                description: 'Aladağlar\'da 3 günlük tırmanış kampımızda 8 farklı rotada tırmanış gerçekleştirdik.',
                difficulty: 'Orta-İleri',
                location: 'Aladağlar, Kayseri',
                coordinator: 'Ahmet Kaya',
                photos: ['aladaglar1.jpg', 'aladaglar2.jpg']
            }),
            new Activity({
                id: 2,
                title: 'Güvenli Tırmanış Teknikleri Eğitimi',
                type: 'Eğitim',
                date: '2024-11-08',
                duration: '6 Saat',
                participants: 15,
                description: 'Başlangıç seviyesindeki tırmanışçılar için güvenlik ekipmanlarının kullanımı.',
                difficulty: 'Başlangıç',
                location: 'HÜDDOSK Eğitim Merkezi',
                coordinator: 'Zeynep Demir'
            })
        ];
    }

    // Static method to get activity by ID
    static getById(id) {
        const activities = this.getAll();
        return activities.find(activity => activity.id === parseInt(id));
    }

    // Static method to get activities by type
    static getByType(type) {
        const activities = this.getAll();
        return activities.filter(activity => 
            activity.type.toLowerCase() === type.toLowerCase()
        );
    }

    // Static method to get upcoming activities
    static getUpcoming() {
        // Bu metod gelecek tarihli faaliyetleri döndürecek
        return [
            new Activity({
                id: 5,
                title: 'Kapadokya Tırmanış Kampı',
                type: 'Tırmanış',
                date: '2024-12-25',
                duration: '4 Gün',
                participants: 0, // Henüz kayıt olmamış
                description: 'Kapadokya\'nın büyüleyici kaya formasyonlarında tırmanış deneyimi.',
                difficulty: 'Orta',
                location: 'Kapadokya, Nevşehir',
                coordinator: 'Ahmet Kaya',
                registrationDeadline: '2024-12-20',
                availableSpots: 8,
                totalSpots: 15
            })
        ];
    }

    // Instance method to validate activity data
    validate() {
        const errors = [];
        
        if (!this.title || this.title.trim() === '') {
            errors.push('Başlık zorunludur');
        }
        
        if (!this.type || this.type.trim() === '') {
            errors.push('Faaliyet türü zorunludur');
        }
        
        if (!this.date) {
            errors.push('Tarih zorunludur');
        }
        
        if (!this.location || this.location.trim() === '') {
            errors.push('Konum zorunludur');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Instance method to save activity (for future database integration)
    save() {
        const validation = this.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        
        this.updatedAt = new Date();
        
        // Burada database'e kaydetme işlemi yapılacak
        console.log('Activity saved:', this.title);
        return this;
    }

    // Instance method to update activity
    update(data) {
        Object.keys(data).forEach(key => {
            if (this.hasOwnProperty(key) && key !== 'id') {
                this[key] = data[key];
            }
        });
        
        this.updatedAt = new Date();
        return this.save();
    }

    // Instance method to delete activity
    delete() {
        // Burada database'den silme işlemi yapılacak
        console.log('Activity deleted:', this.title);
        return true;
    }

    // Instance method to format date for display
    getFormattedDate() {
        return new Date(this.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Instance method to get activity status
    getStatus() {
        const today = new Date();
        const activityDate = new Date(this.date);
        
        if (activityDate > today) {
            return 'upcoming';
        } else if (activityDate.toDateString() === today.toDateString()) {
            return 'today';
        } else {
            return 'completed';
        }
    }

    // Instance method to check if registration is open
    isRegistrationOpen() {
        if (!this.registrationDeadline) return false;
        
        const today = new Date();
        const deadline = new Date(this.registrationDeadline);
        return today <= deadline;
    }

    // Static method to get activity statistics
    static getStatistics() {
        const activities = this.getAll();
        const stats = {
            total: activities.length,
            byType: {},
            totalParticipants: 0,
            averageParticipants: 0
        };

        activities.forEach(activity => {
            // Count by type
            if (!stats.byType[activity.type]) {
                stats.byType[activity.type] = 0;
            }
            stats.byType[activity.type]++;
            
            // Total participants
            stats.totalParticipants += activity.participants;
        });

        stats.averageParticipants = Math.round(stats.totalParticipants / activities.length);
        
        return stats;
    }
}

module.exports = Activity; 