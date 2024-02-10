"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeEmailForCryptonim = exports.dayDateToDate = exports.ingestTerrainData = void 0;
function genPassword() {
    const charCount = 8;
    return Math.random().toString(36).slice(charCount * -1);
}
function cryptonimToUserAuthorPair(cryptonim) {
    return {
        user: {
            username: cryptonim,
            email: `${cryptonim.toLowerCase()}@test.test`,
            password: genPassword(),
        },
        author: {
            nickname: cryptonim,
        }
    };
}
function ingestTerrainData(terrainJson) {
    const result = {
        title: terrainJson.title,
        description: terrainJson.description,
        start: terrainJson.start,
        end: terrainJson.end,
        contribution_min_publication_delay_minutes: terrainJson.contribution_min_publication_delay_minutes,
        contribution_max_publication_delay_minutes: terrainJson.contribution_max_publication_delay_minutes,
        users: terrainJson.cryptonims.map(cryptonimToUserAuthorPair),
        grainePublicationDatetime: terrainJson.grainePublicationDatetime,
        graines: terrainJson.graines
    };
    return result;
}
exports.ingestTerrainData = ingestTerrainData;
function dayDateToDate(dayDate) {
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}
exports.dayDateToDate = dayDateToDate;
async function userWithEmailExists(email) {
    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: email },
    });
    return !!user;
}
async function computeEmailForCryptonim(cryptonim, strapi) {
    const domain = "test.test";
    let email = `${cryptonim}@${domain}`;
    let userExists = await userWithEmailExists(email);
    let index = 1;
    while (userExists) {
        email = `${cryptonim}_${index}@${domain}`;
        userExists = await userWithEmailExists(email);
        index++;
    }
    return email;
}
exports.computeEmailForCryptonim = computeEmailForCryptonim;
