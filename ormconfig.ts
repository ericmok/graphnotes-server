import { ConnectionOptions } from 'typeorm';

let config: ConnectionOptions;
let developmentConfig: ConnectionOptions;
let productionConfig: ConnectionOptions;

developmentConfig = {
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": "test",
   "password": "test",
   "database": "test",

   "synchronize": true,
   "logging": false,

   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};   

productionConfig = {
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_NAME,

   "synchronize": true,
   "logging": false,

   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};

if (process.env.NODE_ENV !== 'production') {
  config = developmentConfig;
} else {
  config = productionConfig;
}

export default config;