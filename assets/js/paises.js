$(document).ready(function () {

    // Verificar se o Web Storage está a funcionar
    if (typeof(Storage) === "undefined") {
        alert('A Web Storage não está a funcionar no teu browser. A funcionalidade de favoritos não está disponível!');
        return;
    }

    const API_URL = 'https://restcountries.com/v3.1/all';
    const $cardsContainer = $('#cards-container');
    const $pagination = $('#pagination');
    const $searchBar = $('#search-bar');
    const $errorContainer = $('#error-container'); // Mensagem de Erro na Pesquisa

    let allCountries = [];
    let filteredCountries = [];
    let currentPage = 1;
    const itemsPerPage = 9;



    // Buscar Dados da API
    function fetchCountries() {
        $.ajax({
            url: API_URL,
            method: 'GET',

            // SUCESS
            success: data => {
                allCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                searchAndDisplay();
            },

            // ERROR
            error: () => console.error('Erro ao carregar os Países.')
        });
    }

    // Função de Pesquisa
    function searchAndDisplay() {
        const query = $searchBar.val().toLowerCase();
        filteredCountries = allCountries.filter(country =>
            country.name.common.toLowerCase().includes(query)
        );

        if (!filteredCountries.length) {
            showError("Não conseguimos encontrar nenhum resultado para a tua Pesquisa!");
        } else {
            hideError();
        }

        currentPage = 1;
        displayCountries();
        setupPagination();
    }

    // Função Mostrar Países
    function displayCountries() {
        $cardsContainer.empty();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            $cardsContainer.append(`
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
                                    class="btn btn-favorite ${isFavorite(country.name.common) ? 'remove-favorite' : 'add-favorite'} rounded-0 my-2 mx-2 fs-16"
                                    data-country-name="${country.name.common}">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    
    // Adicionar/Remover País dos Favoritos
    function toggleFavorite(countryName) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(countryName)) {
            favorites = favorites.filter(fav => fav !== countryName);
        } else {
            favorites.push(countryName);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Verificar se o País está nos Favoritos
    function isFavorite(countryName) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.includes(countryName);
    }

    // Listener para os Botões de Favoritos
    $(document).on('click', '.btn-favorite', function () {
        const countryName = $(this).data('country-name');
        toggleFavorite(countryName);
        $(this).toggleClass('add-favorite remove-favorite');
    });

    // Listener para o Campo de Pesquisa
    $searchBar.on('input', searchAndDisplay);

    // Mostrar Mensagem de Erro
    function showError(message) {
        $errorContainer
            .html(`
                <div>
                    <div class="mb-5 alert alert-warning text-center" role="alert">
                        ${message}
                    </div>
                    <div class="m-5 d-flex align-content-center justify-content-center">
                        <img src="assets/img/no-results.png">
                    </div>
                </div>
            `)
            .show();
    }

    // Esconder Mensagem de Erro
    function hideError() {
        $errorContainer.hide().empty();
    }



    // Paginação
    function setupPagination() {
        $pagination.empty();
        const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
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
                displayCountries();
                setupPagination();
            }
        });
    }



    // Inicializar
    fetchCountries();
});
