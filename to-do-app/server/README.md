## PostgreSQL Database Setup
# Follow these steps to set up your PostgreSQL database for the project:

# Log in to your PostgreSQL server:

sudo su postgres
psql
CREATE USER to_do WITH PASSWORD '123';
ALTER USER to_do CREATEDB;
CREATE DATABASE to_do_app;
GRANT ALL PRIVILEGES ON DATABASE to_do_app TO to_do;
\c to_do_app 


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    status VARCHAR(20)
);


CREATE TABLE user_tasks (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, task_id)
);