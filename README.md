# DishDiscovery

A social media platform for recipes with administrator permissions.

![Profile Page](https://private-user-images.githubusercontent.com/110330434/335786610-e259ba74-a77a-467d-8665-70bec8722f14.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTcyMjg4OTEsIm5iZiI6MTcxNzIyODU5MSwicGF0aCI6Ii8xMTAzMzA0MzQvMzM1Nzg2NjEwLWUyNTliYTc0LWE3N2EtNDY3ZC04NjY1LTcwYmVjODcyMmYxNC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjAxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwMVQwNzU2MzFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02ODMwMDNjMzk5YzFmNWIxMWY3NzMwNWE0ZTY5MTIyYTQ1OGNjMWZkYWI3YTJiNWMxZjgxMTA5NTYyODQ1OWM3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.fxJ_27vyX4lNv1y-LW7JI9UKSL1wMyaSLLuscDkDNSM)

## Table of Contents

- Project Overview
- Features
- Technologies
- UML Class Diagram
- Getting Started
- Usage

## Project Overview

DishDiscovery is a platform that allows users to create (edit and delete) their own recipes and post them publicly. Users can also create recipe books to collect the recipes of their choice while exploring their feed. Like any social media platform, a user can like and comment on any recipe in the feed. There is also a notification system where users can receive notifications based on their preferences (chosen in settings). Users have access to additional features in settings such as account and password settings. They can also search other users and recipes (recipes can be filtered by more than one element). To reach a level of security, each user obtains an access token once logged in. Also, an email would be sent to the user every time he logs in (email entered while registering). Admin permissions include managing ingredient data as well as user posts and accounts (for inappropriate content). Users can report other users in case of inappropriate content too.

## Features

- This application provides an email verification system where users need to verify their email when registering.
- Upon logging in, users get an access token that will be used to access protected routes.
- Refresh tokens were also implemented; they allow users to stay authenticated for longer periods of time without the need to log in repeatedly.
- Once logged in, the user gets redirected to his profile. Here, he can create, edit and delete recipes and recipe books (collection of recipes). If the user wants to stop the creation of a recipe at a certain step, he can save it as pending.
- Once a recipe is posted, they appear automatically in his profile and in his feed (home page). In this page, he can browse other recipes and interact with them; he can like, unlike, comment, reply and even delete his comment if necessary. A user can follow other users and their posts would appear on his feed. If necessary, he can unfollow them.
- Concerning the notifications system, users can choose to be notified for like, comment, follow and post events. He can also delete notifications he doesn’t need.
- To change these preferences, he can go to his settings. There, he can also update his profile, change his password, delete his account and send suggestions.
- A user can also search for other users, recipes (by title) and ingredients to check their availability.
- A user can be a general user or an admin. An admin owns the same permissions and functionalities as a general user. Admins can also warn and ban users in case they violate the rules.
- Admins are responsible of managing ingredients. They can create new ingredients and update them if necessary.
- Admins can also manage suggestions and reports; they can delete them if they are useless or solved.
- Unnecessary or violating comments are deleted by admins.

## Technologies

- React.js
- Redux
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Passport.js
- Nodemailer

## UML Class Diagram

![Uml Class Diagram](https://private-user-images.githubusercontent.com/110330434/335786682-57038597-b62e-45b0-9f6e-a268420c72e3.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTcyMjg5NzAsIm5iZiI6MTcxNzIyODY3MCwicGF0aCI6Ii8xMTAzMzA0MzQvMzM1Nzg2NjgyLTU3MDM4NTk3LWI2MmUtNDViMC05ZjZlLWEyNjg0MjBjNzJlMy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjAxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYwMVQwNzU3NTBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iNDY2NTMyZTdhMmIxOGI1YTcxZWRlMjYwMmVkYzc0NDhhNzQyYThmMTI0OTQ2ZmVhMTUzYmUzYTdkMDAxYzc1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.4RY_cq2FaiddKYlCKHFWF0E9sGV1p9boaKSSVFxmcgs)

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB or MongoDB Atlas account

### Installation

1. Clone the repository

```
git clone https://github.com/geowashere/DishDiscovery.git
```

2. Go to the project directory and install dependencies for both the client and server

```
cd client
npm install
```

```
cd server
npm install
```

3. Create a `.env` file in both the `client` and `server` directories and add the environment variables as shown in the `.env.example` files.
4. Start the server

```
cd server
npm run dev
```

5. Start the client

```
cd client
npm run dev
```

### Configuration

#### `.env Variables`

To be able to register, login, and use all functionalities, all the `.env variables` are required. Check `.env.example` in the server directory.

#### Owner Tool

Run the `./owner-tool.sh` script to access the owner tool, creating, removing admins and other functionalities.

```
./owner-tool.sh
```

## Usage

#### Demo
