"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayDateToDate = exports.terrainJSONToTerrain = void 0;
function genPassword() {
    const charCount = 8;
    return Math.random().toString(36).slice(charCount * -1);
}
function cryptonimToUserAuthoPair(cryptonim) {
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
function terrainJSONToTerrain(terrainJson) {
    const result = {
        title: terrainJson.title,
        description: terrainJson.description,
        start: terrainJson.start,
        end: terrainJson.end,
        contribution_publication_delay: terrainJson.contribution_publication_delay,
        users: terrainJson.cryptonims.map(cryptonimToUserAuthoPair),
        grainePublicationDatetime: terrainJson.grainePublicationDatetime,
        graines: terrainJson.graines
    };
    return result;
}
exports.terrainJSONToTerrain = terrainJSONToTerrain;
function dayDateToDate(dayDate) {
    return new Date(dayDate.year, dayDate.month, dayDate.day);
}
exports.dayDateToDate = dayDateToDate;
