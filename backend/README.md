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
