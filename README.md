## Crypto Rate Service

#### Description

Service for fetching ccrypto rates by binance API & Uniswap
Uses MongoDB and Redis databases

#### How to start?

1. Install node.js (v20+)
2. Run in command line $ npm install
3. Define parameters decribed below in .env file
4. Run in commend line $ npm run start:dev
5. By default at http://localhost:3000/swagger you can see swagger documentation

# initialization parameters in docker container:

| Mode | Environment variable | Description                          |
| ---- | -------------------- | ------------------------------------ |
| all  | INIT_SERVICE_PORT    | Port for run node app (default 3000) |
| all  | INIT_SERVICE_CORS    | Cors status (0 or 1),default 0       |
| ---  | ---                  | ---                                  |
| all  | INIT_MONGODB_URL     | URL for MongoDB connection           |
| all  | INIT_REDIS_DB_URL    | URL for redis database connection    |
