"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
exports.default = {
    /**
     * Every 5 minutes
     */
    '* * * * *': ({ strapi }) => {
        // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
        console.log("youpi");
        (0, fs_1.writeFileSync)('./test---------------.txt', "pipo-cerise", { encoding: 'utf-8' });
    },
};
