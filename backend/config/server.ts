import cronTasks from "./cron-tasks";

export default ({ env }) =>{

    const result = {
        host: env('HOST', '0.0.0.0'),
        port: env.int('PORT', 1337),
        url: "https://api.permacriture.org",
        app: {
            keys: env.array('APP_KEYS'),
        },
        cron: {
            enabled: true,
            tasks: cronTasks,
        }
    };
    const isLocalMode: boolean = !!env('LOCAL_MODE');

    if(isLocalMode){
        delete(result.url);
        console.log("starting in local mode url prop of config/server.ts not set");
    }else{
        console.log(`starting in prod mode url prop of config/server.ts is set to ${result.url}`);
    }

    return result;
} 
