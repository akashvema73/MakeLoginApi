
CREATE DATABASE IF NOT EXISTS user_management_db;
USE user_management_db;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    phone       VARCHAR(20)   NULL,
    role        VARCHAR(20)   NOT NULL DEFAULT 'USER',
    status      VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    created_at  DATETIME      NOT NULL
);

SELECT * FROM users;
SELECT id, name, email, role, status FROM users WHERE status = 'ACTIVE';
SELECT role, COUNT(*) AS total FROM users GROUP BY role;
