# DishDiscovery

A social media platform for recipes with administrator permissions.

[Demo](https://www.youtube.com/watch?v=jhUiONmRWlI)

![Profile Page](https://raw.githubusercontent.com/geowashere/DishDiscovery/main/client/src/assets/profile-page.png)

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

![Uml Class Diagram](https://raw.githubusercontent.com/geowashere/DishDiscovery/main/client/src/assets/uml-diagram.png)

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

6. Import `db.ingredients.json` file in the MongoDB Compass.

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

https://www.youtube.com/watch?v=jhUiONmRWlI
