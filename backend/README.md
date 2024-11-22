## How to start

1. create .env file and put secrets

```
# example .env

PORT=8000
JWT_SECRET=KimSeyeonBabo
JWT_EXPIRES_IN=1h
DB_USER=username
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=social_computing
CODE_SALT=9999
```

2. install dependencies with `$npm install`

3. start the server with
   `$npm run dev`

## Structure of the codebase
src directory includes all core implementation code.
### middleware
This folder includes all middleware used in backend server (jwtMiddleware, uploader)
### interfaces
This folder includes definitions of types. However, type was not strictly applied to the project due to early deadline.
### handler
All api endpoints are directed to functions in handler. Handlers include all core feature implementation.
### database
Handles connection to database. Basically, all api endpoints use one pooled connection to mysql database.
