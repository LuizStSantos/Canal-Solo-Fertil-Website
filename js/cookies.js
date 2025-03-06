document.addEventListener('DOMContentLoaded', function() {
    if (!getCookie('cookieConsent')) {
        let banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = '<p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nosso uso de cookies. <button id="accept-cookies">Aceitar</button></p>';
        document.body.appendChild(banner);
        document.getElementById('accept-cookies').addEventListener('click', function() {
            setCookie('cookieConsent', 'accepted', 30);
            banner.remove();
        });
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
    }
    return "";
}
