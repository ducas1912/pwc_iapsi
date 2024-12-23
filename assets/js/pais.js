$(document).ready(function () {
    // Verificar se o Web Storage está a funcionar
    if (!localStorage) {
        alert('A Web Storage não está funcional no seu browser. A funcionalidade de favoritos não está disponível!');
        return;
    }


    const API_URL = 'https://restcountries.com/v3.1/all';
    const countryName = new URLSearchParams(window.location.search).get('name');

    if (!countryName) {
        alert('Nenhum país especificado.');
        return;
    }

    // Buscar Dados do País
    function fetchCountryDetails() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (data) {
                const country = data.find(c => c.name.common === countryName);
                if (country) displayCountryDetails(country);
                else alert('País não encontrado.');
            },
            error: function () {
                console.error('Erro ao buscar detalhes do país.');
            }
        });
    }

    // Detalhes do País
    function displayCountryDetails(country) {
        $('#country-name').html(`
            ${country.name.common}
            <button class="btn btn-favorite ${isFavorite(country.name.common) ? 'remove-favorite' : 'add-favorite'}" 
                data-country-name="${country.name.common}">
            </button>
        `);

        $('#country-flag').attr('src', country.flags.svg);

        $('#country-details').html(`
            <tr><th>Nome Oficial</th><td>${country.name.official}</td></tr>
            <tr><th>Capital</th><td>${country.capital?.[0] || 'N/A'}</td></tr>
            <tr><th>Região</th><td>${country.region}</td></tr>
            <tr><th>Sub-região</th><td>${country.subregion || 'N/A'}</td></tr>
            <tr><th>População</th><td>${country.population.toLocaleString()}</td></tr>
            <tr><th>Área</th><td>${country.area.toLocaleString()} km²</td></tr>
            <tr><th>Idiomas</th><td>${Object.values(country.languages || {}).join(', ') || 'N/A'}</td></tr>
            <tr><th>Moeda</th><td>${Object.values(country.currencies || {}).map(c => c.name).join(', ') || 'N/A'}</td></tr>
            <tr><th>Fuso Horário</th><td>${country.timezones.join(', ')}</td></tr>
        `);

        // Alternar Favoritos
        $('.btn-favorite').click(function () {
            toggleFavorite($(this).data('country-name'));
            $(this).toggleClass('add-favorite remove-favorite');
        });
    }

    // Estado do Favorito
    function toggleFavorite(countryName) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(countryName)) {
            localStorage.setItem('favorites', JSON.stringify(favorites.filter(fav => fav !== countryName)));
        } else {
            favorites.push(countryName);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }

    // Verificar se o País está nos Favoritos
    function isFavorite(countryName) {
        return (JSON.parse(localStorage.getItem('favorites')) || []).includes(countryName);
    }

    // Inicializar
    fetchCountryDetails();
});
