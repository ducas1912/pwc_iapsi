document.addEventListener('DOMContentLoaded', function () {
    // SETAS DO CAROUSEL (GRAYSCALE E OPACIDADE)
        const carousel = document.querySelector('#carouselDescobre');
        const prevControl = document.querySelector('.carousel-control-prev-icon');
        const nextControl = document.querySelector('.carousel-control-next-icon');
    
        function updateArrowStyles() {
            const activeSlide = carousel.querySelector('.carousel-item.active');
            const isFirstSlide = activeSlide === carousel.querySelector('.carousel-item:first-child');
            const isLastSlide = activeSlide === carousel.querySelector('.carousel-item:last-child');
    
            // Configura os estilos com base no slide ativo
            if (isFirstSlide) {
                prevControl.style.filter = 'grayscale(100%)';
                prevControl.style.opacity = '0.5';
                nextControl.style.filter = 'none'; // Azul (sem filtro)
                nextControl.style.opacity = '1';
            } else {
                prevControl.style.filter = 'none';
                prevControl.style.opacity = '1';
                nextControl.style.filter = 'grayscale(100%) invert(1)';
                nextControl.style.opacity = '0.5';
            }
        }
    
        // Atualizar setas no início
        updateArrowStyles();
    
        // Atualizar setas após cada transição
        carousel.addEventListener('slid.bs.carousel', updateArrowStyles);
    });
    // SETAS DO CAROUSEL (GRAYSCALE E OPACIDADE)
    