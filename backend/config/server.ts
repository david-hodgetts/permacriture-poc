import cronTasks from "./cron-tasks";

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: "https://api.permacriture.org",
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron:{
    enabled: true,
    tasks: cronTasks,
  }
});
