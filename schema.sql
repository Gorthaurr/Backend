CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         status BOOLEAN DEFAULT FALSE,
                         user_id INTEGER REFERENCES users(id),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER REFERENCES users(id),
                        token VARCHAR(500) NOT NULL UNIQUE,
                        expires TIMESTAMP NOT NULL
);

CREATE TABLE device_block_schedule (
                                       id SERIAL PRIMARY KEY,
                                       device_id INTEGER REFERENCES devices(id),
                                       block_from TIME NOT NULL,
                                       block_to TIME NOT NULL
);
