$(document).ready(function () {

    // Verificar se o Web Storage está a funcionar
    if (typeof(Storage) === 'undefined') {
        alert('A Web Storage não está a funcionar no teu browser. A funcionalidade de favoritos não está disponível!');
        return;
    }

    const API_URL = 'https://restcountries.com/v3.1/all';
    const $favoritesContainer = $('#favorites-container');
    const $pagination = $('#pagination');
    const itemsPerPage = 9;
    let favoriteCountries = [];
    let currentPage = 1;

    // Buscar Dados da API
    function fetchCountries() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function (data) {
                processFavorites(data);
            },
            error: function () {
                console.error('Erro ao buscar Países.');
            }
        });
    }

    // Processar a Lista de Favoritos armazenada
    function processFavorites(countries) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoriteCountries = countries.filter(country => favorites.includes(country.name.common));

        if (!favoriteCountries.length) {
            showEmptyFavoritesMessage();
        } else {
            currentPage = 1;
            displayFavorites();
            setupPagination();
        }
    }

    // Mostrar os Países favoritos
    function displayFavorites() {
        $favoritesContainer.empty();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = favoriteCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            $favoritesContainer.append(`
                <div class="col-md-4 p-3">
                    <div class="card custom-card">
                        <img src="${country.flags.svg}" class="card-img-flag" alt="${country.name.common}">
                        <div class="card-body text-center">
                            <h5 class="card-title fs-25 fw-bold text-black mb-3">${country.name.common}</h5>
                            <div class="d-flex flex-row flex-md-column flex-lg-row justify-content-center my-3">
                                <p class="card-text opacity-85 mb-0 fs-16 me-4 me-md-0 me-lg-4">
                                    <span class="fw-semi-bold fs-18">Capital<br></span>
                                    ${country.capital ? country.capital[0] : 'N/A'}
                                </p>
                                <p class="card-text opacity-85 mb-0 fs-16 ms-4 ms-md-0 ms-lg-4">
                                    <span class="fw-semi-bold fs-18">Continente<br></span>
                                    ${country.region}
                                </p>
                            </div>
                            <div>
                                <a href="pais.html?name=${country.name.common}" class="btn btn-explorar rounded-0 my-2 mx-2 fs-16">Explorar</a>
                                <button 
                                    class="btn btn-favorite remove-favorite rounded-0 my-2 mx-2 fs-16" 
                                    data-country-name="${country.name.common}">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Remover País dos Favoritos
    $(document).on('click', '.remove-favorite', function () {
        const countryName = $(this).data('country-name');
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        favorites = favorites.filter(fav => fav !== countryName);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Atualizar a exibição
        fetchCountries();
    });

    // Mostrar mensagem para quando a lista de Favoritos está vazia
    function showEmptyFavoritesMessage() {
        $favoritesContainer.html(`
            <p class="text-center fs-18 opacity-85">
                Parece que a tua lista de favoritos está vazia. Explora a lista e escolhe os teus favoritos!
            </p>
            <div class="d-flex align-content-center justify-content-center">
                <a href="paises.html" class="btn-explorar my-5 my-md-4">Explorar</a>
            </div>
            <div class="d-flex align-content-center justify-content-center opacity-30 my-4">
                <img src="assets/img/no-favourites.svg" id="img-no-favourites" height="400px">
            </div>
        `);
    }


    
    // Paginação
    function setupPagination() {
        $pagination.empty();
        const totalPages = Math.ceil(favoriteCountries.length / itemsPerPage);
        if (!totalPages) return;

        // Botão "Anterior"
        $pagination.append(`
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">&laquo;</a>
            </li>
        `);

        // Intervalo de páginas (2 antes e 2 depois)
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            $pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Botão "Próximo"
        $pagination.append(`
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">&raquo;</a>
            </li>
        `);

        // Mudar de Página
        $pagination.find('.page-link').click(function (e) {
            e.preventDefault();
            const page = parseInt($(this).data('page'));
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                currentPage = page;
                displayFavorites();
                setupPagination();
            }
        });
    }



    // Inicializar
    fetchCountries();
});
