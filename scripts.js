document.addEventListener('DOMContentLoaded', function() {
    // Configuração do Player com HLS.js
    const video = document.getElementById('player');
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource('https://canalsolofertil.live/memfs/dd19a992-2e7c-4ffd-97f6-fde810284756.m3u8');
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://canalsolofertil.live/memfs/dd19a992-2e7c-4ffd-97f6-fde810284756.m3u8';
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }

    // Controle da grade de programação: oculta linhas com horários já passados
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const rows = document.querySelectorAll('.schedule-grid .grid-row');
    rows.forEach(row => {
        const timeText = row.querySelector('div:first-child').textContent.trim();
        const [hourStr, minuteStr] = timeText.split(':');
        const rowHour = parseInt(hourStr, 10);
        const rowMinute = parseInt(minuteStr, 10);

        if (rowHour < currentHour || (rowHour === currentHour && rowMinute < currentMinute)) {
            row.style.display = 'none';
        }
    });

    // Controle do menu lateral
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const closeMenu = document.querySelector('.close-menu');

    menuToggle.addEventListener('click', function() {
        sideMenu.classList.add('open');
    });

    closeMenu.addEventListener('click', function() {
        sideMenu.classList.remove('open');
    });

    // Envio do formulário de contato via AJAX
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "enviar_contato.php", true);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onload = function() {
            if (xhr.status === 200) {
                alert("Mensagem enviada com sucesso!");
                form.reset();
            } else {
                alert("Falha ao enviar a mensagem.");
            }
        };

        xhr.send(formData);
    });
});