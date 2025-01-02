// MUDAR A COR DAS SETAS DO CAROUSEL
$(document).ready(function () {
    const $carousel = $('#carouselDescobre');
    const $iconPrev = $('.carousel-control-prev-icon');
    const $iconNext = $('.carousel-control-next-icon');
    const $controlPrev = $('.carousel-control-prev');
    const $controlNext = $('.carousel-control-next');


    function updateButtons() {
        const $activeSlide = $carousel.find('.carousel-item.active');
        const isFirstSlide = $activeSlide.is(':first-child');

        if (isFirstSlide) {
            $iconPrev.css({
                filter: 'grayscale(100%)',
                opacity: '0.5',
            });
            $controlPrev.css({
                pointerEvents: 'none', // Não deixa clicar no botão
            });
            $iconNext.css({
                filter: 'none',
                opacity: '1',
            });
            $controlNext.css({
                pointerEvents: 'auto',
            });
        } 

        else {
            $iconPrev.css({
                filter: 'none',
                opacity: '1',
            });
            $controlPrev.css({
                pointerEvents: 'auto',
            });
            $iconNext.css({
                filter: 'grayscale(100%) invert(1)',
                opacity: '0.5',
            });
            $controlNext.css({
                pointerEvents: 'none', // Não deixa clicar no botão
            });
        }
    }

    // Atualizar as setas no início
    updateButtons();

    // Atualizar setas após cada transição
    $carousel.on('slid.bs.carousel', updateButtons);
});


    

// MOSTRAR PAISES ALEATORIAMENTE
$(document).ready(function () {
    const API_URL = 'https://restcountries.com/v3.1/all';
    const container = $('#randomCountries');

    // Buscar Dados da API
    function fetchCountries() {
        $.ajax({
            url: API_URL,
            method: 'GET',

            // SUCESS
            success: function (countries) {

                // Baralha o Array dos Países inteiros
                    // [...countries] ::: Cria uma cópia do Array original
                    // .sort(() => 0.5 - Math.random()) ::: Math.random() gera entre 0 e 1 e (0.5 - 0 = 0.5) (0.5 - 1 = -0.5) ... Se valor = negativo, 1 ordernado antes de 2 |  Se valor = positivo, 1 ordernado depois de 2
                const shuffled = [...countries].sort(() => 0.5 - Math.random());

                // Seleciona os 3 primeiros Países do array baralhado
                const randomCountries = shuffled.slice(0, 3);

                // Ciclo de forEach para dar Append dos 3 Países ao Container (#randomCountries)
                container.empty();  // o .empty limpa todos elementos anteriores (Limpar a Mensagem de Erro)
                randomCountries.forEach (country => {
                    
                    container.append(`
                        <div class="card p-2 mx-3 my-3 my-lg-0 card_country">
                            <a href="pais.html?name=${country.name.common}" class="text-decoration-none text-black">
                                <img src="${country.flags.svg}" class="card-img-top padding_imgCountry object-fit-cover" width="300px" height="200px" alt="${country.name.common}">
                                <div class="card-body text-center align-content-center py-4 px-2">
                                    <p class="card-text fw-medium fs-18">${country.name.common}</p>
                                </div>
                            </a>
                        </div>
                    `);

                });
            },

            // ERROR
            error: () => console.error('Erro ao carregar os Países!')

        });
    }

    // Inicializar
    fetchCountries();
});
