# RestaurantSPA

My very first quite simple project in Angular and ExpressJS. <br/>
By doing it I have got basic understanding of how these frameworks work. <br/>
<br/>Especially in Angular I've learned about how components work, how to use services to share data amoung application, split responsibilities, use interceptors, store tokens required for authentication and set up guards. <br/>
<br/>In ExpressJS I've got to know how to connect to mongdb database, create and manage models, set up routes and secure them using middleware. <br/>


## Features
  - User Authentication using JWT
  - User roles
  - Browsing, reserving, commenting and rating dishes
  - Adding new or modifying existing dishes

<br/>

## Users in application
### AnonymousUser
  - Browse dishes
  - Create new account
  - Login

### User:
  - Reserve, comment, rate dishes

### Manager:
  - Add, Delete and modify dishes

### Admin:
  - Manage user roles
  - Ban users

<br/>

# How to use
In "backend" folder ".env" file with provided variables is required:  
  - DB_CONNECTION=mongodb+srv://user:password@db
  - JWT_SECRET=secret
