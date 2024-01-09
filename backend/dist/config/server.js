"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_tasks_1 = __importDefault(require("./cron-tasks"));
exports.default = ({ env }) => {
    const result = {
        host: env('HOST', '0.0.0.0'),
        port: env.int('PORT', 1337),
        url: "https://api.permacriture.org",
        app: {
            keys: env.array('APP_KEYS'),
        },
        cron: {
            enabled: true,
            tasks: cron_tasks_1.default,
        }
    };
    const isLocalMode = !!env('LOCAL_MODE');
    if (isLocalMode) {
        delete (result.url);
        console.log("starting in local mode url prop of config/server.ts not set");
    }
    else {
        console.log(`starting in prod mode url prop of config/server.ts is set to ${result.url}`);
    }
    return result;
};
