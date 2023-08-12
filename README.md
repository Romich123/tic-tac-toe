# Tic tac toe

Simple implementation of tic tac toe game

# Setup

Install all dependencies
Go to client folder and run

`npm run build`

Move files from /client/dist to /server/src/public
Go to server folder and run

`npm start`

or just run this command sequence from root directory
```
cd client
npm i
npm run build
cd ..
del /q ./server/src/public/*
copy ./client/dist/* ./server/src/public
cd server
npm i
npm start
```