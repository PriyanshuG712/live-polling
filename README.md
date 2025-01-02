# Live Polling System

A real-time live polling system for teachers and students built with Vite, React, Tailwind CSS, Express.js, Socket.io, and MongoDB. This system allows teachers to create and manage polls, while students can participate and view live results.

## Features

### Teacher Features:
- Create new polls with a question and multiple-choice answers.
- Set a timer for each question (default: 60 seconds).
- View live polling results from students.
- Restrict the creation of new questions until all students have answered the current one or if no question is active.

### Student Features:
- Join a poll by entering a unique name.
- Answer a poll within the given time.
- See live results after answering or after a timeout (maximum 60 seconds to answer).

## Technologies Used
- **Frontend:** Vite + React, Tailwind CSS
- **Backend:** Express.js, Socket.io
- **Database:** MongoDB

## Deployment
- Frontend Link: https://live-polling-nine.vercel.app/
