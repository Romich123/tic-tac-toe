# Tic tac toe

Simple implementation of tic tac toe game

# Setup

Install all dependencies \
Go to client folder and run

`npm run build`

Move files from /client/dist to /server/src/public \
Go to server folder and run

`npm start`

or just run this command sequence from root directory

```
cd server
npm i
cd ../client
npm i
npm run build
cd ..
rd ./server/src/public -r
mkdir ./server/src/public
move ./client/dist/* ./server/src/public
cd server
npm start
```

Dont't forget to create .env file \
.env must contain "SECRET" variable equal to any string
