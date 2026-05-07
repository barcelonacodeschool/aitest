# AI Chat demo with Gemini and openAI

## Installation

* Fork and clone this repo 
* In the root folder install the dependencies with `npm i`
* In the root folder create an `.env` file
* Add your API key for either openAI or Gemini:
```
GEMINI_API_KEY=
OPENAI_API_KEY=
```

## Contents

### `index.js` contains:

1. Example of using simple external API (Chuck Norris Jokes API) at https://api.chucknorris.io
* send a GET request to `localhost:4000/randomjoke`

2. Example of using Gemini AI for chat without any memory context
* send a POST request to `localhost:4000/ai/chatgemini`
* in the body of the request send a message inside `message` key

3. Example of using openAI for chat without any memory context
* send a POST request to `localhost:4000/ai/chatopenai`
* in the body of the request send a message inside `message` key

To start run `nodemon index.js`

### `index3.js` contains:

1. Example of using Gemini AI for chat without memory context saved/retrieved from the mongoDB
* send a POST request to `localhost:4000/ai/gemini`
* in the body of the request send a message inside `message` key and a sessionID inside `sessionId` key. Keep the value of `sessionId` the same for the entire conversation between the same user and a model.

2. Example of using openAI for chat without memory context saved/retrieved from the mongoDB
* send a POST request to `localhost:4000/ai/openai`
* in the body of the request send a message inside `message` key and a sessionID inside `sessionId` key. Keep the value of `sessionId` the same for the entire conversation between the same user and a model.

To start run `nodemon index3.js`

