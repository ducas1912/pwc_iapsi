// COR DAS SETAS DO CAROUSEL
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
                pointerEvents: 'none',
            });
            $iconNext.css({
                filter: 'none', // Azul (sem filtro)
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
                pointerEvents: 'none',
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
    const container = $('#randomCountries');

    function fetchCountries() {
        $.ajax({
            url: 'https://restcountries.com/v3.1/all',
            method: 'GET',

            // SUCESSO
            success: function (countries) {

                // Seleciona 3 Países Aleatórios
                const randomCountries = [];
                while (randomCountries.length < 3) {
                    const country = countries[Math.floor(Math.random() * countries.length)];
                    if (!randomCountries.includes(country)) randomCountries.push(country);
                }

                // Ciclo de forEach para dar Append dos 3 Países ao container #randomCountries
                container.empty();  // o .empty limpa os anteriores
                randomCountries.forEach (country => {
                    // utilizar sempre `` , se utilizarmos '' temos que pôr sempre +
                    container.append(`
                        <div class="card p-2 mx-3 card_country">
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

            // ERRO
            error: function () {
                console.error('Erro ao carregar os países.');
            }

        });
    }

    fetchCountries();
});
