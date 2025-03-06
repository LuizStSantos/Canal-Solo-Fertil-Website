/* ========= HLS Video Player Initialization ========= */
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('player');
    if (video) {
        loadHlsScript().then(() => {
            // Initialize HLS video player after hls.js is loaded
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(video.querySelector('source').src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = video.querySelector('source').src;
                video.addEventListener('loadedmetadata', function() {
                    video.play();
                });
            }
        });
    }

/* ========= Schedule Grid Control ========= */
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
        } else {
            row.style.display = 'grid';
        }
    });

/* ========= Side Menu Control ========= */
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const closeMenu = document.querySelector('.close-menu');
    if (menuToggle && sideMenu && closeMenu) {
        menuToggle.addEventListener('click', function() {
            sideMenu.classList.add('open');
        });
        closeMenu.addEventListener('click', function() {
            sideMenu.classList.remove('open');
        });
    }

/* ========= Scheduler Population ========= */
    fetch('data/program.json')
      .then(response => response.json())
      .then(data => {
        const allPrograms = data.filter(item => item.name !== "Vinhetas");
        const now = new Date();
        let displayPrograms = allPrograms;

        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
          displayPrograms = allPrograms.filter(item => {
            const [hour, minute] = item.start.split(':');
            const programTime = new Date();
            programTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0);
            return programTime > now;
          }).slice(0, 3);
        }

        const scheduleContent = document.getElementById('schedule-content');
        if (scheduleContent) {
          displayPrograms.forEach(item => {
            const [hour, minute] = item.start.split(':');
            const timeDisplay = `${hour}:${minute}`;
            const row = document.createElement('div');
            row.className = 'grid-row';
            row.innerHTML = `<div>${timeDisplay}</div><div>${item.name}</div>`;
            scheduleContent.appendChild(row);
          });
        }
      })
      .catch(error => console.error('Error loading program schedule:', error));
});

function loadHlsScript() {
    return new Promise(function(resolve, reject) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}