CREATE TABLE food_sources (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  citation TEXT NOT NULL,
  licence TEXT NOT NULL,
  reuse_approved BOOLEAN NOT NULL DEFAULT FALSE,
  retrieved_on DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE foods (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  filipino_name VARCHAR(150) NOT NULL,
  english_name VARCHAR(150) NOT NULL,
  colour_group ENUM('red', 'orange_yellow', 'green', 'blue_purple', 'white_brown'),
  category ENUM('fruit', 'vegetable', 'grain') NOT NULL,
  energy_kcal DECIMAL(8,2),
  protein_g DECIMAL(8,2),
  carbohydrate_g DECIMAL(8,2),
  fat_g DECIMAL(8,2),
  fibre_g DECIMAL(8,2),
  source_id BIGINT UNSIGNED NOT NULL,
  source_record VARCHAR(255) NOT NULL,
  FOREIGN KEY (source_id) REFERENCES food_sources(id),
  UNIQUE (source_id, source_record),
  INDEX foods_filter (category, colour_group),
  CHECK (energy_kcal IS NULL OR energy_kcal >= 0),
  CHECK (protein_g IS NULL OR protein_g >= 0),
  CHECK (carbohydrate_g IS NULL OR carbohydrate_g >= 0),
  CHECK (fat_g IS NULL OR fat_g >= 0),
  CHECK (fibre_g IS NULL OR fibre_g >= 0)
) ENGINE=InnoDB;

CREATE TABLE user_food_preferences (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  food_id BIGINT UNSIGNED NOT NULL,
  preference ENUM('liked', 'disliked') NOT NULL,
  PRIMARY KEY (user_id, food_id),
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE recipes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  servings SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES accounts(id),
  CHECK (servings > 0),
  INDEX recipes_owner (user_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE recipe_ingredients (
  recipe_id BIGINT UNSIGNED NOT NULL,
  food_id BIGINT UNSIGNED NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  PRIMARY KEY (recipe_id, food_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id)
) ENGINE=InnoDB;

CREATE TABLE recipe_steps (
  recipe_id BIGINT UNSIGNED NOT NULL,
  position SMALLINT UNSIGNED NOT NULL,
  instruction TEXT NOT NULL,
  PRIMARY KEY (recipe_id, position),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  CHECK (position > 0)
) ENGINE=InnoDB;

CREATE TABLE user_favorite_recipes (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  recipe_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, recipe_id),
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  eaten_at DATETIME(3) NOT NULL,
  meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE,
  INDEX entries_owner_time (user_id, eaten_at)
) ENGINE=InnoDB;

CREATE TABLE entry_foods (
  entry_id BIGINT UNSIGNED NOT NULL,
  food_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (entry_id, food_id),
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id)
) ENGINE=InnoDB;

CREATE TABLE entry_recipes (
  entry_id BIGINT UNSIGNED NOT NULL,
  recipe_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (entry_id, recipe_id),
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
) ENGINE=InnoDB;
