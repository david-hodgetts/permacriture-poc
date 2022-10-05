
const isProd = window.location.host == 'app.permacriture.org';

export default {
    baseUrl: isProd ? "https://api.permacriture.org" : "http://localhost:1337"
};