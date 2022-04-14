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
## Docker
This project was created befeore I though about adding Docker, so unfortunately it is not customizable very much.   
Docker compose starts database with custom data.    

You should now have access to:
  - <a>http://localhost:4200/</a> - front
  - <a>http://localhost:3000/</a> - back
  - <a>http://localhost:8088/</a> - database explorer

Available accounts: (username-password)
  - admin-admin
  - manager-manager
  - client1-client1
  - client2-client2
  - client3-client3

Start containers:
```
sudo docker-compose -f docker-compose.yaml up -d
```

Close containers:
```
sudo docker-compose -f docker-compose.yaml down
```
## Normal
In "backend" folder ".env" file with provided variables is required:  
  - DB_CONNECTION=mongodb+srv://user:password@db
  - JWT_SECRET=secret

# Some screenschots
### Menu
![Screenshot from 2022-03-15 22-31-26](https://user-images.githubusercontent.com/92322072/158476875-65514eb7-2950-4cb3-a1ad-69b49213e8ff.png)
### Cart
![Screenshot from 2022-03-15 22-30-53](https://user-images.githubusercontent.com/92322072/158476865-71f0442d-a219-4891-b56a-9203875dfd4c.png)
### Admin page
![Screenshot from 2022-03-15 22-31-52](https://user-images.githubusercontent.com/92322072/158476882-8d1df83b-85c3-4d48-9525-ef140d113781.png)
### Dish details and comments
![Screenshot from 2022-03-15 22-32-53](https://user-images.githubusercontent.com/92322072/158476888-916d3269-34da-4b61-ac52-f2a01762b910.png)
