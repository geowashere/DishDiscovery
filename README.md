# DishDiscovery

A social media platform for recipes with administrator permissions.

![Profile Page](https://private-user-images.githubusercontent.com/110330434/326399716-4bd9b559-00dc-44f0-88ac-5697a09963a9.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTYyODQxNTksIm5iZiI6MTcxNjI4Mzg1OSwicGF0aCI6Ii8xMTAzMzA0MzQvMzI2Mzk5NzE2LTRiZDliNTU5LTAwZGMtNDRmMC04OGFjLTU2OTdhMDk5NjNhOS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNTIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDUyMVQwOTMwNTlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iZDgwYTE0YjIyYjU5NjIzZjU3MWY3YzNhNjgzNzFjNGE5YWVhM2NmZGE3NDc3NWIxMDM3ZDVhOWQzMzgxZWVlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.SuuMpN2RNwjocpHyQaaWJN_WW_jgKpxlJheb3GTPw8c)

## Table of Contents

- Project Overview
- Features
- Technologies
- UML Class Diagram
- Getting Started
- Usage
- License

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

![Uml Class Diagram](https://private-user-images.githubusercontent.com/110330434/326398238-ef6e85f5-2037-40ba-b3ab-59a67b0446f0.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTYyODQyMDAsIm5iZiI6MTcxNjI4MzkwMCwicGF0aCI6Ii8xMTAzMzA0MzQvMzI2Mzk4MjM4LWVmNmU4NWY1LTIwMzctNDBiYS1iM2FiLTU5YTY3YjA0NDZmMC5qcGc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNTIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDUyMVQwOTMxNDBaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iYTZlZjk4NmFjZGEzZDBkNDJhNjI1YmRmOTU3YmIyOWE0ZDM5Zjc0NzY3Y2UyZjViNTU2ZWM1OWExNjFjMGU3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.CHrZ7Tvdvov1_QxKqUk4Aw9eapzbOzwQP-VKR-g6TIs)

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB or MongoDB Atlas account

### Installation

1. Clone the repository

```
git clone https://github.com/geowashere/Recipe-App.git
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

## License

This project is licensed under the MIT License.
