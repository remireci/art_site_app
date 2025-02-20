export default function manifest() {
    return {
        "name": "Art Exhibitions Calendar | Discover Contemporary Art in Europe",
        "short_name": "Art Now Database",
        "description": "Discover upcoming art exhibitions in Western Europe. Explore museums, galleries, and cultural spaces showcasing modern and contemporary art. Search by country, city, venue, or artist!",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#4a90e2",
        "icons": [
            {
                "src": '/favicon.ico',
                "sizes": 'any',
                "type": 'image/png',
            },
            {
                "src": "/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "maskable"
            },
            {
                "src": "/icons/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable"
            },
        ],
    }
}