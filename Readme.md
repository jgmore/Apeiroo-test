# Apeiroo-test

This repository contains the full-stack application developed for the Apeiroo Labs test. It comprises a backend built with Node.js and TypeScript, and a frontend developed with React and TypeScript.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) (comes bundled with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (for the backend database)
- [Git](https://git-scm.com/) (for cloning the repository)

## Project Structure

The repository is structured as follows:

```
Apeiroo-test/
├── backend/
└── frontend/
```

- `backend/`: Contains the Node.js and TypeScript backend application.
- `frontend/`: Contains the React and TypeScript frontend application.

## Installation
Clone the repository and install dependencies.

```bash
git clone https://github.com/jgmore/Apeiroo-test.git
cd Apeiroo-test
```

## Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   In the `backend` directory inside src folder, create a `.env` file with the following environment variables:

   ```env
   DB_USER=your_database_user
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_PASSWORD=your_database_password
   DB_PORT=5432
   HOST_PORT=3001
   FRONTEND_URL=http://localhost:3000,http://localhost:3002
   ```

   Replace `your_database_user`, `your_database_password`, and `your_database_name` with your PostgreSQL credentials.

4. **Set up the database:**

   Ensure your PostgreSQL server is running and a database named `your_database_name` exists. If not, create it:

   ```sql
   CREATE DATABASE your_database_name;
   ```

5. **Create the `duties` table:**

   After selecting your database, run the following command to create the required table:

   ```sql
   CREATE TABLE duties (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     version TIMESTAMP
   );
   ```

6. **Build the backend:**

   ```bash
   npm run build
   ```

7. **Start the backend server:**

   ```bash
   npm start
   ```

   The backend server should now be running on `http://localhost:3000`.

## Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   In the `frontend` directory, create a `.env` file with the following environment variable:

   ```env
   PORT=3000
   ```

   This sets the base URL for API requests to the backend.

4. **Build the frontend:**

   ```bash
   npm run build
   ```

   This will create a `build/` directory with the production-ready files.

5. **Serve the frontend:**

   To serve the frontend using a simple static server, you can use the `serve` package:

   ```bash
   npm install -g serve
   serve -s build
   ```

   The frontend should now be running on `http://localhost:3000`

## Running Tests

### Backend Tests

To run the backend tests:

```bash
cd backend
npm test
```

### Frontend Tests

To run the frontend tests:

```bash
cd frontend
npm test
```



## Notes

- Ensure that the backend server is running before starting the frontend to allow API requests to be processed correctly.



## Frontend guide
When you open the frontend application in the browser, you will see the duties already created on the system.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend01.jpg?raw=true)

If you click the Edit icon next to a duty, it will enter edit mode.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend02.jpg?raw=true)

The name field of the duty cannot be blank.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend03.jpg?raw=true)

And it needs at least 3 characters for the name of the duty.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend04.jpg?raw=true)

Once you enter a valid name for the duty, you need to press the save icon.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend05.jpg?raw=true)

You will see the duty updated and a message: "Duty updated successfully."
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend06.jpg?raw=true)

To delete a duty, you need to click the edit button first to enter the edit mode.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend07.jpg?raw=true)

If you click on the delete icon, it will ask for a confirmation and you need to click "Yes" to delete it.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend08.jpg?raw=true)

The duty will be removed from the list of duties and you will see a message "Duty deleted."
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend09.jpg?raw=true)

You can add new duties to the list from the blank field at the top. It will validate that the name of the duty is not blank.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend10.jpg?raw=true)

And the name needs to be a minimun of 3 characters.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend11.jpg?raw=true)

When you enter a valid name, you need to press the Add button.
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend12.jpg?raw=true)

You will see the duty added to the list of duties and a message "Duty added"
![Image Description](https://github.com/jgmore/Apeiroo-test/blob/main/Img/frontend13.jpg?raw=true)
