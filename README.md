# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. With the help of Mongoose, the app is able to send, receive and alter data aabout the user profile and clothing items. The routes folder organizes routes based on functionality, the models maintain the rule schemas that manage the type of data that is transferred and manipulated. The controllers contain the code that executes receiving, sending, changing and deleting data organized by the routes modules.

# Technologies used

MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like documents. It is where the user profile data and clothing inventory is stored.

Node.js is utilized to run JavaScript server-side and handle asynchronous operations efficiently.

Express.js complements Node.js to simplify the creation of routes and middleware. "express.json()" is helpful for parsing JSON bodies from requests and GET, POST, DELETE, etc. requests are organized into routes based on app endpoints.

The goal is to create a server with an API and user authorization.

## Project Pitch Video

Check out [https://drive.google.com/file/d/15Cc9exzkvg58heW0WYZXV_yFgtcLeSSz/view?usp=sharing], where I describe my
project and some challenges I faced while building it.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
