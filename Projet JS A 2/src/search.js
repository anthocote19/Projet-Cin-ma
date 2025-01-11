import './style.css';
const API_KEY = 'votre_api_key';
const searchBar = document.getElementById('search-bar');
const searchResults = document.getElementById('search-results');
const loadMoreButton = document.getElementById('load-more');
let currentPage = 1;
let currentQuery = '';

async function fetchFilms(query, page = 1) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie&page=${page}`);
        const data = await response.json();
        if (data.Response === 'True') {
            return data.Search || [];
        } else {
            console.warn(data.Error);
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
        return [];
    }
}


function afficherFilms(films) {
    films.forEach(film => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${film.Poster !== 'N/A' ? film.Poster : 'placeholder.jpg'}" alt="${film.Title}">
            <h3>${film.Title}</h3>
            <a href="movie.html?id=${film.imdbID}">En savoir plus</a>
        `;
        searchResults.appendChild(card);
    });
}


async function rechercherFilms() {
    const query = searchBar.value.trim();
    if (query.length < 3) {
        searchResults.innerHTML = '<p>Veuillez entrer au moins 3 caractères pour rechercher.</p>';
        loadMoreButton.style.display = 'none';
        return;
    }

    currentQuery = query;
    currentPage = 1;
    searchResults.innerHTML = ''; 
    const films = await fetchFilms(query, currentPage);
    afficherFilms(films);

    loadMoreButton.style.display = films.length > 0 ? 'block' : 'none';
}


async function chargerPlus() {
    currentPage++;
    const films = await fetchFilms(currentQuery, currentPage);
    afficherFilms(films);
}


searchBar.addEventListener('input', rechercherFilms);
loadMoreButton.addEventListener('click', chargerPlus);

