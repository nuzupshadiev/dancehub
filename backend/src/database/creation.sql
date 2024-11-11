-- Active: 1714920350103@@127.0.0.1@3306@social_computing
CREATE TABLE user(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    name VARCHAR(255),
    email VARCHAR(255) COMMENT 'Email',
    password VARCHAR(255) COMMENT 'Password',
    profilePicture VARCHAR(255) COMMENT 'Profile Picture',
    createdAt DATETIME COMMENT 'Create Time'
) COMMENT '';

CREATE TABLE project(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    title VARCHAR(255) COMMENT 'Title',
    administratorId int COMMENT 'Administrator Id',
    Foreign Key (administratorId) REFERENCES user(id)
) COMMENT '';

CREATE TABLE video(  
    id int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
    version datetime NOT NULL COMMENT 'Version',
    title VARCHAR(255) COMMENT 'Title',
    description VARCHAR(255) COMMENT 'Description',
    uploaderId int COMMENT 'Uploader Id',
    projectId int COMMENT 'Project Id',
    videoUrl VARCHAR(255) COMMENT 'Video Url',
    likes int COMMENT 'Likes',
    Foreign Key (uploaderId) REFERENCES user(id),
    Foreign Key (projectId) REFERENCES project(id),
    primary key (id, version)
) COMMENT '';

create table comment(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    videoId int COMMENT 'Video Id',
    version datetime comment 'Version',
    start int comment 'Start Time',
    end int comment 'End Time',
    userId int COMMENT 'User Id',
    content VARCHAR(255) COMMENT 'Content',
    likes int COMMENT 'Likes',
    modifiedAt DATETIME COMMENT 'Modified Time',
    Foreign Key (userId) REFERENCES user(id),
    Foreign Key (videoId) REFERENCES video(id)
)

CREATE TABLE likes(
    userId int COMMENT 'User Id',
    commentId int COMMENT 'Commend Id',
    Foreign Key (userId) REFERENCES user(id),
    Foreign Key (commentId) REFERENCES comment(id),
    primary key (userId, commentId)
) COMMENT '';

create table member(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    userId int COMMENT 'User Id',
    projectId int COMMENT 'Project Id',
    Foreign Key (userId) REFERENCES user(id),
    Foreign Key (projectId) REFERENCES project(id)
)

ALTER TABLE likes ADD UNIQUE KEY unique_user_comment (userId, commentId);
