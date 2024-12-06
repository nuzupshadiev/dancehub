create table comment_tag (
  id int not null auto_increment comment 'Primary Key',
  name varchar(255) default null comment 'Name',
  projectId int default null comment 'Project Id',
  videoId int default null comment 'Video Id',
  version datetime default null comment 'Version',
  commentId int default null comment 'Comment Id',
  primary key (id),
  foreign key (projectId) references project(id) on delete cascade,
  foreign key (videoId) references video(id) on delete cascade,
  foreign key (commentId) references comment(id) on delete cascade
);

create table reply_tag (
  id int not null auto_increment comment 'Primary Key',
  name varchar(255) default null comment 'Name',
  projectId int default null comment 'Project Id',
  videoId int default null comment 'Video Id',
  version datetime default null comment 'Version',
  replyId int default null comment 'Comment Id',
  primary key (id),
  foreign key (projectId) references project(id) on delete cascade,
  foreign key (videoId) references video(id) on delete cascade,
  foreign key (replyId) references reply(id) on delete cascade
);