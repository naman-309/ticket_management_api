# Support Ticket Management API

Node.js + Express.js + Neon PostgreSQL

## Ready now

- Full folder structure
- Neon DB connection
- setupDb.js
- Register  
- Login
- Logout
- bcrypt password hashing
- JWT httpOnly cookie
- authenticateUser
- authorizeRoles
- Helmet
- CORS
- Rate limiting
- Logging
- Central error handler

Ticket, Comment and User module files are already created as placeholders.

## Database tables

users
tickets
comments

## Relationships

users.id -> tickets.customerid
users.id -> tickets.agentid
users.id -> comments.userid
tickets.id -> comments.ticketid

## Auth APIs

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

## Run

npm install

Add your Neon DATABASE_URL in `.env`

Then:

node src/db/setupDb.js

Then:

npm run dev

## Register body

{
  "name": "Naman",
  "email": "naman@test.com",
  "password": "123456"
}

## Login body

{
  "email": "naman@test.com",
  "password": "123456"
}
