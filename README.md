# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/)

## Downloading
Clone this repository:
```
git clone https://github.com/ElenVasileva/nodejs2024Q1-service.git
```
Checkout the branch 'Containerization-and-Database-(PostgreSQL)-&-ORM'
## Installing NPM modules

```
npm install
```

## Create .env file

Create .env file from .env.example and set variables you need:
```
DATABASE_URL="postgresql://username:userpassword@postgres:5432/homelibrary?schema=public"
```

## Running application in docker container

```
docker compose up
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Logging

Log file 'combined.log' could be find in the folder 'logs'

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
