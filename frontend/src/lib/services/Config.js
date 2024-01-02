import { browser } from "$app/environment";

const isProd = browser ? (window.location.host == 'app.permacriture.org') : false;

export default {
    baseUrl: isProd ? "https://api.permacriture.org" : "http://localhost:1337",
    notificationDuration: 4000, // expressed in millis
    updateRate: 5000, // desired rate at which we poll the backend for new data (expressed in millis)
};