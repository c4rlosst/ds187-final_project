CREATE TABLE accounts (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at DATETIME(3),
  disabled_at DATETIME(3),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

CREATE TABLE profiles (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  gender VARCHAR(100),
  contact_number VARCHAR(30),
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CHECK (CHAR_LENGTH(TRIM(display_name)) BETWEEN 1 AND 100)
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  role ENUM('admin', 'moderator') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE sessions (
  token_hash BINARY(32) PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  INDEX sessions_user (user_id),
  INDEX sessions_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE email_verifications (
  token_hash BINARY(32) PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  INDEX verifications_user (user_id)
) ENGINE=InnoDB;
