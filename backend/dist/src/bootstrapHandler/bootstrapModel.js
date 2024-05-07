"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeUniqueUsername = exports.dayDateToDate = exports.ingestTerrainData = exports.cryptonimToUserAuthorPair = void 0;
function genPassword() {
    const charCount = 8;
    return Math.random().toString(36).slice(charCount * -1);
}
// normalizes usernames for use as email local parts.
function userNameToEmail(username, domain) {
    const localPart = username.toLowerCase()
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const email = `${localPart}@${domain}`;
    return email;
}
async function cryptonimToUserAuthorPair(cryptonim) {
    const username = await computeUniqueUsername(cryptonim);
    const domain = "permacriture.org";
    const email = userNameToEmail(username, domain);
    console.log(`email ${email} and username ${username} computed for cryptonim -> ${cryptonim}`);
    return {
        user: {
            username: username,
            email: email,
            password: genPassword(),
        },
        author: {
            nickname: username,
        }
    };
}
exports.cryptonimToUserAuthorPair = cryptonimToUserAuthorPair;
function ingestTerrainData(terrainJson) {
    const result = {
        title: terrainJson.title,
        description: terrainJson.description,
        start: terrainJson.start,
        end: terrainJson.end,
        contribution_min_publication_delay_minutes: terrainJson.contribution_min_publication_delay_minutes,
        contribution_max_publication_delay_minutes: terrainJson.contribution_max_publication_delay_minutes,
        cryptonims: terrainJson.cryptonims,
        users: [],
        grainePublicationDatetime: terrainJson.grainePublicationDatetime,
        graines: terrainJson.graines
    };
    return result;
}
exports.ingestTerrainData = ingestTerrainData;
function dayDateToDate(dayDate) {
    return new Date(dayDate.year, dayDate.month - 1, dayDate.day);
}
exports.dayDateToDate = dayDateToDate;
async function usernameExists(username) {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { username: username },
    });
    return !!user;
}
async function userWithEmailExists(email) {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: email },
    });
    return !!user;
}
async function computeUniqueUsername(cryptonim) {
    let username = cryptonim;
    let userExists = await usernameExists(username);
    let index = 2;
    while (userExists) {
        username = `${cryptonim}_${index}`;
        userExists = await usernameExists(username);
        index++;
    }
    return username;
}
exports.computeUniqueUsername = computeUniqueUsername;
