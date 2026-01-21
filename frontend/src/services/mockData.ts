/**
 * GeoWatch Mock Data Service
 * Author: Ram (Sriram Vissakoti)
 * Description: Simulates backend API with localStorage persistence
 * 
 * This service provides a fully functional demo without any backend dependency.
 */

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    subscription: 'free' | 'pro' | 'enterprise';
}

export interface AOI {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    geojson: any;
    changeType: 'deforestation' | 'construction' | 'waterbody' | 'agricultural' | 'other';
    monitoringFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    confidenceThreshold: number;
    emailAlerts: boolean;
    inAppNotifications: boolean;
    status: 'active' | 'pending' | 'inactive';
    createdAt: string;
    updatedAt: string;
    lastMonitored?: string;
    totalChangesDetected: number;
}

export interface NDVIData {
    date: string;
    ndvi: number;
    quality: 'good' | 'cloudy' | 'partial';
}

export interface ChangeAlert {
    _id: string;
    aoi_id: string;
    detection_date: string;
    change_percent: number;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    change_type: string;
    before_image_url: string;
    after_image_url: string;
    description: string;
}

// Storage keys
const STORAGE_KEYS = {
    USER: 'geowatch_user',
    TOKEN: 'geowatch_token',
    AOIS: 'geowatch_aois',
    THEME: 'geowatch_theme',
};

// Helper functions
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const delay = (ms: number = 300): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Real Satellite Imagery URLs from NASA, ESA, and Open Source
const SAMPLE_IMAGES = {
    before: [
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/151000/151807/amazon_oli_2023225_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/152000/152061/india_vir_2023340_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/151000/151890/chilika_oli_2023244_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/150000/150887/dubai_oli_2023009_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/151000/151426/mumbai_oli_2023139_lrg.jpg',
    ],
    after: [
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/152000/152288/amazon_oli_2024001_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/152000/152415/india_vir_2024025_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/151000/151950/chilika_oli_2023299_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/151000/151577/dubai_oli_2023189_lrg.jpg',
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/152000/152100/mumbai_oli_2023355_lrg.jpg',
    ],
    // Fallback images if NASA images don't load
    fallback: {
        before: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/800px-Camponotus_flavomarginatus_ant.jpg',
        after: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pleiades_large.jpg/800px-Pleiades_large.jpg',
    }
};

// Initial demo AOIs
const DEMO_AOIS: AOI[] = [
    {
        _id: 'demo_aoi_1',
        userId: 'demo_user',
        name: 'Amazon Rainforest Zone A',
        description: 'Monitoring deforestation activities in the northern Amazon basin',
        geojson: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[-60.5, -3.2], [-60.5, -2.8], [-60.1, -2.8], [-60.1, -3.2], [-60.5, -3.2]]]
            }
        },
        changeType: 'deforestation',
        monitoringFrequency: 'weekly',
        confidenceThreshold: 70,
        emailAlerts: true,
        inAppNotifications: true,
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastMonitored: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalChangesDetected: 5,
    },
    {
        _id: 'demo_aoi_2',
        userId: 'demo_user',
        name: 'Mumbai Coastal Development',
        description: 'Tracking urban expansion along the Mumbai coastline',
        geojson: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[72.8, 19.0], [72.8, 19.1], [72.9, 19.1], [72.9, 19.0], [72.8, 19.0]]]
            }
        },
        changeType: 'construction',
        monitoringFrequency: 'biweekly',
        confidenceThreshold: 60,
        emailAlerts: true,
        inAppNotifications: true,
        status: 'active',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastMonitored: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        totalChangesDetected: 12,
    },
    {
        _id: 'demo_aoi_3',
        userId: 'demo_user',
        name: 'Chilika Lake Ecosystem',
        description: 'Monitoring water level and vegetation changes in Chilika Lake',
        geojson: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[85.3, 19.7], [85.3, 19.8], [85.5, 19.8], [85.5, 19.7], [85.3, 19.7]]]
            }
        },
        changeType: 'waterbody',
        monitoringFrequency: 'monthly',
        confidenceThreshold: 75,
        emailAlerts: false,
        inAppNotifications: true,
        status: 'active',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastMonitored: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalChangesDetected: 3,
    },
    {
        _id: 'demo_aoi_4',
        userId: 'demo_user',
        name: 'Punjab Agricultural Belt',
        description: 'Seasonal crop pattern analysis and agricultural land changes',
        geojson: {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [[[75.8, 30.9], [75.8, 31.1], [76.2, 31.1], [76.2, 30.9], [75.8, 30.9]]]
            }
        },
        changeType: 'agricultural',
        monitoringFrequency: 'weekly',
        confidenceThreshold: 65,
        emailAlerts: true,
        inAppNotifications: true,
        status: 'pending',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalChangesDetected: 0,
    },
];

// ============================================================
// Authentication Service
// ============================================================

export const AuthService = {
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        await delay(500);

        // Simple validation
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (password.length < 4) {
            throw new Error('Invalid credentials');
        }

        // Create or get user
        const user: User = {
            id: generateId(),
            email,
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            createdAt: new Date().toISOString(),
            subscription: 'free',
        };

        const token = 'mock_jwt_token_' + generateId();

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        // Initialize demo AOIs for new user
        const existingAois = localStorage.getItem(STORAGE_KEYS.AOIS);
        if (!existingAois) {
            const userAois = DEMO_AOIS.map(aoi => ({ ...aoi, userId: user.id }));
            localStorage.setItem(STORAGE_KEYS.AOIS, JSON.stringify(userAois));
        }

        return { user, token };
    },

    async signup(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
        await delay(500);

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const user: User = {
            id: generateId(),
            email,
            name: name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            createdAt: new Date().toISOString(),
            subscription: 'free',
        };

        const token = 'mock_jwt_token_' + generateId();

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);

        // Initialize demo AOIs for new user
        const userAois = DEMO_AOIS.map(aoi => ({ ...aoi, userId: user.id }));
        localStorage.setItem(STORAGE_KEYS.AOIS, JSON.stringify(userAois));

        return { user, token };
    },

    async getCurrentUser(): Promise<User | null> {
        await delay(200);

        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (!token || !userStr) {
            return null;
        }

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    logout(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },
};

// ============================================================
// AOI Service
// ============================================================

export const AOIService = {
    async getAll(): Promise<AOI[]> {
        await delay(300);

        const aoisStr = localStorage.getItem(STORAGE_KEYS.AOIS);
        if (!aoisStr) {
            return [];
        }

        try {
            return JSON.parse(aoisStr);
        } catch {
            return [];
        }
    },

    async getById(id: string): Promise<AOI | null> {
        await delay(200);

        const aois = await this.getAll();
        return aois.find(aoi => aoi._id === id) || null;
    },

    async create(data: Omit<AOI, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'totalChangesDetected'>): Promise<AOI> {
        await delay(400);

        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        const user = userStr ? JSON.parse(userStr) : { id: 'demo_user' };

        const newAoi: AOI = {
            _id: generateId(),
            userId: user.id,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalChangesDetected: 0,
        };

        const aois = await this.getAll();
        aois.push(newAoi);
        localStorage.setItem(STORAGE_KEYS.AOIS, JSON.stringify(aois));

        return newAoi;
    },

    async update(id: string, data: Partial<AOI>): Promise<AOI> {
        await delay(300);

        const aois = await this.getAll();
        const index = aois.findIndex(aoi => aoi._id === id);

        if (index === -1) {
            throw new Error('AOI not found');
        }

        aois[index] = {
            ...aois[index],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEYS.AOIS, JSON.stringify(aois));
        return aois[index];
    },

    async delete(id: string): Promise<void> {
        await delay(300);

        const aois = await this.getAll();
        const filtered = aois.filter(aoi => aoi._id !== id);
        localStorage.setItem(STORAGE_KEYS.AOIS, JSON.stringify(filtered));
    },
};

// ============================================================
// Analysis Service (Mock NDVI & Reports)
// ============================================================

export const AnalysisService = {
    async getNDVITimeSeries(aoiId: string): Promise<{ data: NDVIData[]; trend: string; statistics: any }> {
        await delay(400);

        const aoi = await AOIService.getById(aoiId);
        if (!aoi) {
            throw new Error('AOI not found');
        }

        // Generate realistic NDVI data for the last 12 months
        const data: NDVIData[] = [];
        const baseDate = new Date();
        let baseNdvi = 0.55 + Math.random() * 0.15;

        for (let i = 11; i >= 0; i--) {
            const date = new Date(baseDate);
            date.setMonth(date.getMonth() - i);

            // Add seasonal variation (higher NDVI in monsoon months for India)
            const month = date.getMonth();
            const seasonalFactor = [6, 7, 8, 9].includes(month) ? 0.15 : -0.05;

            // Add some random variation
            const randomVariation = (Math.random() - 0.5) * 0.1;

            const ndvi = Math.max(0.1, Math.min(0.9, baseNdvi + seasonalFactor + randomVariation));

            data.push({
                date: date.toISOString().split('T')[0],
                ndvi: parseFloat(ndvi.toFixed(4)),
                quality: Math.random() > 0.2 ? 'good' : 'cloudy',
            });
        }

        // Calculate trend
        const firstHalf = data.slice(0, 6).reduce((sum, d) => sum + d.ndvi, 0) / 6;
        const secondHalf = data.slice(6).reduce((sum, d) => sum + d.ndvi, 0) / 6;
        const diff = secondHalf - firstHalf;

        let trend = 'stable';
        let trendDescription = 'Vegetation health is stable';

        if (diff > 0.05) {
            trend = 'increasing';
            trendDescription = 'Vegetation health is improving';
        } else if (diff < -0.05) {
            trend = 'decreasing';
            trendDescription = 'Vegetation health is declining';
        }

        const ndviValues = data.map(d => d.ndvi);

        return {
            data,
            trend,
            statistics: {
                min: Math.min(...ndviValues).toFixed(4),
                max: Math.max(...ndviValues).toFixed(4),
                avg: (ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length).toFixed(4),
                current: ndviValues[ndviValues.length - 1].toFixed(4),
                trend,
                trendDescription,
            },
        };
    },

    async getChangeAlerts(aoiId: string): Promise<ChangeAlert[]> {
        await delay(300);

        const aoi = await AOIService.getById(aoiId);
        if (!aoi) {
            return [];
        }

        // Generate mock alerts based on totalChangesDetected
        const alerts: ChangeAlert[] = [];
        const count = aoi.totalChangesDetected || Math.floor(Math.random() * 5) + 1;

        const severities: ChangeAlert['severity'][] = ['low', 'moderate', 'high', 'critical'];
        const descriptions = {
            deforestation: ['Tree cover loss detected', 'Forest clearing activity observed', 'Vegetation reduction identified'],
            construction: ['New construction detected', 'Building footprint identified', 'Urban expansion observed'],
            waterbody: ['Water level change detected', 'Shoreline modification observed', 'Water coverage change'],
            agricultural: ['Crop pattern change detected', 'Field boundary modification', 'Harvest activity observed'],
            other: ['Land use change detected', 'Surface modification observed', 'Terrain change identified'],
        };

        for (let i = 0; i < count; i++) {
            const daysAgo = Math.floor(Math.random() * 60) + 1;
            const changePercent = parseFloat((Math.random() * 15 + 2).toFixed(2));

            alerts.push({
                _id: generateId(),
                aoi_id: aoiId,
                detection_date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
                change_percent: changePercent,
                severity: severities[Math.floor(changePercent / 5)] || 'moderate',
                change_type: aoi.changeType,
                before_image_url: SAMPLE_IMAGES.before[i % SAMPLE_IMAGES.before.length],
                after_image_url: SAMPLE_IMAGES.after[i % SAMPLE_IMAGES.after.length],
                description: descriptions[aoi.changeType]?.[i % 3] || 'Change detected in monitored area',
            });
        }

        return alerts.sort((a, b) => new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime());
    },

    async generateReport(aoiId: string): Promise<any> {
        await delay(600);

        const aoi = await AOIService.getById(aoiId);
        if (!aoi) {
            throw new Error('AOI not found');
        }

        const ndviData = await this.getNDVITimeSeries(aoiId);
        const alerts = await this.getChangeAlerts(aoiId);

        return {
            report_title: 'GeoWatch Analysis Report',
            generated_at: new Date().toISOString(),
            generated_by: 'GeoWatch Platform',
            aoi: {
                id: aoi._id,
                name: aoi.name,
                description: aoi.description,
                change_type: aoi.changeType,
                monitoring_frequency: aoi.monitoringFrequency,
                status: aoi.status,
                created_at: aoi.createdAt,
            },
            ndvi_analysis: ndviData.statistics,
            total_alerts: alerts.length,
            recent_alerts: alerts.slice(0, 5),
            footer: 'Generated by GeoWatch — Built by Ram',
        };
    },

    async getSummaryStats(): Promise<{
        totalAOIs: number;
        activeMonitoring: number;
        recentAlerts: number;
        coverageArea: string;
    }> {
        await delay(200);

        const aois = await AOIService.getAll();
        const totalAOIs = aois.length;
        const activeMonitoring = aois.filter(aoi => aoi.status === 'active').length;
        const recentAlerts = aois.reduce((sum, aoi) => sum + (aoi.totalChangesDetected || 0), 0);

        // Mock coverage area calculation
        const coverageArea = `${(totalAOIs * 2.5 + Math.random() * 5).toFixed(1)} km²`;

        return {
            totalAOIs,
            activeMonitoring,
            recentAlerts,
            coverageArea,
        };
    },
};

// ============================================================
// Export all services
// ============================================================

export default {
    Auth: AuthService,
    AOI: AOIService,
    Analysis: AnalysisService,
};
