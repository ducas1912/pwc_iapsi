$(document).ready(() => {

    // Verificar se o Web Storage está a funcionar
    if (typeof(Storage) === 'undefined') {
        alert('A Web Storage não está a funcionar no teu browser. A funcionalidade de favoritos não está disponível!');
        return;
    }

    const API_URL = 'https://restcountries.com/v3.1/all';
    const countryName = new URLSearchParams(window.location.search).get('name');

    // Se nenhum País for especificado
    if (!countryName) {
        alert('Nenhum país especificado.');
        return;
    }

    // Buscar Dados do País na API 
    const fetchCountryDetails = () => {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: data => {
                const country = data.find(c => c.name.common === countryName);
                country ? displayCountryDetails(country) : alert('País não encontrado.');
            },
            error: () => console.error('Erro ao buscar detalhes do país.')
        });
    };

    // Detalhes do País
    const displayCountryDetails = country => {
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
            <tr><th>Moeda</th><td>${Object.values(country.currencies || {})
                .map(c => c.name).join(', ') || 'N/A'}</td></tr>
            <tr><th>Fuso Horário</th><td>${country.timezones.join(', ')}</td></tr>
        `);

        // Favoritos
        $('.btn-favorite').click(function () {
            toggleFavorite($(this).data('country-name'));
            $(this).toggleClass('add-favorite remove-favorite');
        });
    };

    // Adicionar/Remover País dos Favoritos
    const toggleFavorite = name => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(name)) {
            favorites = favorites.filter(fav => fav !== name);
        } else {
            favorites.push(name);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    // Verificar se o país está nos Favoritos
    const isFavorite = name => {
        return (JSON.parse(localStorage.getItem('favorites')) || []).includes(name);
    };

    // Inicializar
    fetchCountryDetails();
});
