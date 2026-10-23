// 1. Sélection des éléments
const inputVille = document.getElementById('cityInput');
const btnRechercher = document.getElementById('searchBtn');
const tempEl = document.getElementById('temperature');
const cityNameEl = document.getElementById('cityName');
const descEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weatherIcon');
const weatherCard = document.getElementById('weatherCard');
const errorEl = document.getElementById('errorMsg');
const loadingEl = document.getElementById('loading');

// Détails
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');
const visibilityEl = document.getElementById('visibility');

const API_KEY = 'c9ea5fc0601c035f3dd24ef32e0e07cd';

// 2. Fonction de recherche
function chercherMeteo(ville) {
    // Affiche le loading, cache erreur + carte
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    weatherCard.classList.add('hidden');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&appid=${API_KEY}&units=metric&lang=fr`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ville introuvable');
            }
            return response.json();
        })
        .then(data => {
            // 3. On a les données météo ICI
            console.log(data); // Regarde dans la console (F12)

            // --- Infos principales ---
            cityNameEl.textContent = data.name;
            tempEl.textContent = Math.round(data.main.temp) + '°';
            descEl.textContent = data.weather[0].description;

            // --- Icône météo ---
            const iconCode = data.weather[0].icon; // ex: "01d", "10n"
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconEl.src = iconUrl;
            weatherIconEl.alt = data.weather[0].description;

            // --- Détails ---
            humidityEl.textContent = data.main.humidity + '%';
            windEl.textContent = Math.round(data.wind.speed * 3.6) + ' km/h'; // m/s → km/h
            pressureEl.textContent = data.main.pressure + ' hPa';

            // Lever / coucher du soleil (timestamp Unix → heure locale)
            if (data.sys.sunrise && data.sys.sunset) {
                const sunriseDate = new Date(data.sys.sunrise * 1000);
                const sunsetDate = new Date(data.sys.sunset * 1000);
                sunriseEl.textContent = sunriseDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                sunsetEl.textContent = sunsetDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            }

            // Visibilité (en mètres → km)
            if (data.visibility) {
                visibilityEl.textContent = (data.visibility / 1000).toFixed(1) + ' km';
            }

            // Afficher la carte
            weatherCard.classList.remove('hidden');
        })
        .catch(err => {
            errorEl.textContent = err.message;
            errorEl.classList.remove('hidden');
        })
        .finally(() => {
            loadingEl.classList.add('hidden');
        });
}

// 4. Event listeners
btnRechercher.addEventListener('click', () => {
    const ville = inputVille.value.trim();
    if (!ville) return;
    chercherMeteo(ville);
});

inputVille.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnRechercher.click();
});