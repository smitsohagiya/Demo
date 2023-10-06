# Demo

## Index

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running Project](#running-project)

### Introduction
- Demo project.

### Prerequisites
| **Plugin** | **Version**|
| ------ | ------ |
| Node | ^18.12.0 |
| Mongo | ^^6.9.1 |

### Installation
<br />

> ##### 1. Setting up your secret details in .env
- Add database related details
```sh
NODE_ENV=NODE_ENV
PORT=PORT
APP_URL=SERVER_BASEURL
DATABASE_URL=DATABASE_URL
JWT_SECRETKEY=JWT_SECRETKEY
JWT_EXPIRE=JWT_EXPIRE
```

> ##### 2. Run migrations if you have any migrations
- Fist Go to 'src' directory and run below command
```sh
npx migrate-mongo up
```

### Running Project

> ##### 1. For Development
```sh
npm run dev
```

> ##### 2. For Production
```sh
npm run build 
npm run start
```