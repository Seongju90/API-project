# Welcome to GroundBnB!
Live Link: https://airbnb-api-project1.herokuapp.com/

This is my very first copy of a website with a front-end and back-end, that I have ever made in my life. During my adventure in coding, I will keep this and look back on it and remind myself of
where I was before, and where I am in the future. Although it may not be the best, I hope you will enjoy skimming through a future web developer's first website!

# Languages, Frameworks, Libraries

### Frontend

![JS](https://img.shields.io/badge/JAVASCRIPT-grey?for-the-badge&logo=javascript)  ![RT](https://img.shields.io/badge/REACT-black?for-the-badge&logo=react) ![RX](https://img.shields.io/badge/REDUX-purple?for-the-badge&logo=redux) ![HTML](https://img.shields.io/badge/HTML5-yellow?for-the-badge&logo=html5) ![CSS](https://img.shields.io/badge/CSS3-blue?for-the-badge&logo=css3)

### Backend
![SQ](https://img.shields.io/badge/SEQUELIZE-red?for-the-badge&logo=sequelize) ![NODE](https://img.shields.io/badge/NODE.JS-grey?for-the-badge&logo=nodedotjs) ![EX](https://img.shields.io/badge/EXPRESS-orange?for-the-badge&logo=express) ![SQL3](https://img.shields.io/badge/SQLITE3-darkblue?for-the-badge&logo=sqlite)

### Host
![HKU](https://img.shields.io/badge/HEROKU-purple?for-the-badge&logo=heroku)

# Wiki Links
- [API Documentation](https://github.com/Seongju90/API-project/wiki/API-Documentation)
- [Database Schema](https://github.com/Seongju90/API-project/wiki/Database-Schema-Design)

# Landing Page
You can access the profile dropdown which leads to login and signup, when clicking login it will give you an option for a demouser. My landing page also displays all the spot listings available.
![Alt text](vscode-remote://wsl%2Bubuntu-20.04/home/adduser/appacademy/w12-project/airbnb-project/frontend/public/images/readmeImages/landingpage.png)
# Features

## Spots
- Landing pages will display all the spots available in my database, and when clicking each individual spot will redirect to that spots's personal page.

- Users can create a spot only if they are logged in, otherwise the Become a Host link will not render. It will also throw errors if there are non-valid data inputted.

- Users can edit a spot only if they are the owner of the spot, otherwise the button will not render.

- Users can delete a spot if they are the owner of the spot, otherwise the button will not render.

- Users can upload an img when creating a spot, but it must end with jpg, png, or jpeg or it will throw errors.

## Reviews
- Reviews for each spot will render when landing on the page.

- Users can create reviews for each individual spot only if they are NOT the owner and IF THEY are logged. If they do not satisfy these conditions the Write a Review button will not render.

- You can delete a review only if you are the owner of the review.

# Future Features
- Bookings CRUD and Google API will be added hopefully in the future
