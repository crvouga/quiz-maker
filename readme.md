# Learning Tool

This is an example learning tool app. It's meant to interop with a LMS (like Canvas or Blackboard) using LTI 1.3

![Image](/docs/high-level.png)

## What does the app do?

The app lets course instructors to create quizzes and students to take those quizzes

## How to run the app locally?

Install server/client app dependencies

```
npm install
```

Build the client app whenever the client code changes

```
npm run client:build:watch
```

Run the server app whenever the server code changes.
The server app serves the client app to the LMS

```
npm run server:watch
```

## Where does LTI fit in?

## LTI Concept: Deep Linking
