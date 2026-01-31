import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
export default api

// Goong API Key từ biến môi trường
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

// Hàm geocode với Goong (cần API key hợp lệ)
export async function geocodeGoong(query) {
    // Fallback về Nominatim nếu không có key hoặc key không hợp lệ
    if (!GOONG_API_KEY ) {
        console.warn('Goong API key không hợp lệ, chuyển sang dùng Nominatim');
        return geocodeNominatim(query);
    }

    try {
        const params = new URLSearchParams({
            address: query,
            api_key: GOONG_API_KEY,
        });

        const url = `https://rsapi.goong.io/geocode?${params.toString()}`;
        const res = await fetch(url);
        
        if (!res.ok) {
            console.warn('Goong API lỗi, chuyển sang Nominatim');
            return geocodeNominatim(query);
        }
        
        const data = await res.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        const result = data.results[0];
        const location = result.geometry.location;
        
        return {
            lat: location.lat,
            lon: location.lng,
            display_name: result.formatted_address,
            raw: result
        };
    } catch (error) {
        console.warn('Goong API error:', error.message, '- fallback to Nominatim');
        return geocodeNominatim(query);
    }
}

// Nominatim (miễn phí, không cần key)
async function geocodeNominatim(query) {
    const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '1',
        addressdetails: '1',
    });

    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
    const res = await fetch(url, { 
        headers: { 
            'Accept': 'application/json',
            'User-Agent': 'GeoWorks App' // Nominatim yêu cầu User-Agent
        } 
    });
    
    if (!res.ok) throw new Error('Geocoding failed: ' + res.status);
    const data = await res.json();
    
    if (!Array.isArray(data) || data.length === 0) {
        return null;
    }
    
    const item = data[0];
    return {
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        raw: item
    };
}