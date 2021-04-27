# On-Demand-Application
Assignment API Framework - Postgres - ORM Sequelize

On-Demand-Application is app service system based on customer orders. So when there is an order from a consumer, this service provider will immediately respond to it(Like Gojek, Grab, etc)

## Base Url
http://localhost:7001/

## Usage For Development
```
# Step:
1. npm install
2. npm run sequelize-create-db-development
3. npm run sequelize-create-table-user
4. npm run sequelize-create-table-order
5. npm run sequelize-create-column-isdone-order
6. npm run sequelize-db-migrate
7. npm run dev

# using:
1. npm run dev -> for running on development

# Run on http://localhost:7001
```

## Usage For Testing
```
# Step:
1. npm install
2. npm run sequelize-create-db-test
3. npm run sequelize-create-table-user
4. npm run sequelize-create-table-order
5. npm run sequelize-create-column-isdone-order
6. npm run sequelize-db-migrate-test
7. npm run test

# using:
1. npm run test -> for testing

# Run on http://localhost:7001
```

