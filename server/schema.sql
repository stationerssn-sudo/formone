CREATE TABLE users (
  idusers INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(160) NULL,
  position VARCHAR(80) NULL,
  email VARCHAR(190) NULL UNIQUE,
  password VARCHAR(255) NULL,
  PRIMARY KEY (idusers)
);

CREATE TABLE reset_code (
  idreset_code INT NOT NULL AUTO_INCREMENT,
  userid INT NULL,
  code VARCHAR(45) NULL,
  time DATETIME NULL,
  PRIMARY KEY (idreset_code),
  INDEX userid_idx (userid),
  CONSTRAINT reset_code_user_fk FOREIGN KEY (userid) REFERENCES users (idusers)
    ON DELETE CASCADE ON UPDATE CASCADE
);
