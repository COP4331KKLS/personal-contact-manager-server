# personal-contact-manager-server

### Getting Started
- Install node.js
- Install node package manager
- Run `npm install` to install all dependencies
  - Keeping node and npm updated will usually fix issues with this step
- Setup MONGODB_URI using command line
  - Example: ` export MONGODB_URI='<URI>'`
- Start application with `npm start`

### Accessing Database
- Monk is a node package that makes it easier to use mongodb. For interaction like adding, reading, updating, etc, refer to the monk documentation [HERE](https://automattic.github.io/monk/).

### Endpoints
All endpoints have a base URL of **https://personal-contacts-manager.herokuapp.com**

#### Authentication
##### Register User
| Request Component  | Specification                              |
|--------|--------------------------------------------------------|
| Route  | "/register"                                            |
| Method | POST                                                   |
| Query  | None                                                   |
| Header | { username: `username`, password: `password`}.         |
  
##### Login User
| Request Component  | Specification                              |
|--------|--------------------------------------------------------|
| Route  | "/login".                                              |
| Method | POST                                                   |
| Query  | None                                                   |
| Header | { username: `username`, password: `password`}.         |
