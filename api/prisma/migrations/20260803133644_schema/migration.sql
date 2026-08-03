-- ============================================================
-- SCHEMA
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
 
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS distribution_brokers;
DROP TABLE IF EXISTS distributions;
DROP TABLE IF EXISTS forms;
DROP TABLE IF EXISTS brokers;
DROP TABLE IF EXISTS users;
 
SET FOREIGN_KEY_CHECKS = 1;
 
CREATE TABLE users (
  id         CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL, -- bcrypt hash
  name       VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE brokers (
  id            CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  daily_cap     INT NOT NULL,
  timezone      VARCHAR(64) NOT NULL,        -- IANA tz, e.g. "Asia/Manila"
  opening_time  VARCHAR(5) NOT NULL,         -- "09:00" 24h local to broker tz
  closing_time  VARCHAR(5) NOT NULL,         -- "18:00"
  working_days  VARCHAR(20) NOT NULL,        -- comma list, 0=Sun..6=Sat e.g. "1,2,3,4,5"
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
CREATE TABLE forms (
  id         CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE distributions (
  id         CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  form_id    CHAR(36) NOT NULL UNIQUE,       -- unique = enforces "one distribution per form"
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_distributions_form FOREIGN KEY (form_id) REFERENCES forms(id)
);
 
CREATE TABLE distribution_brokers (
  id              CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  distribution_id CHAR(36) NOT NULL,
  broker_id       CHAR(36) NOT NULL,
  percentage      INT NOT NULL,              -- 0-100 target share
  is_active       BOOLEAN NOT NULL DEFAULT TRUE, -- active *inside this distribution*
  CONSTRAINT fk_db_distribution FOREIGN KEY (distribution_id) REFERENCES distributions(id),
  CONSTRAINT fk_db_broker FOREIGN KEY (broker_id) REFERENCES brokers(id),
  UNIQUE KEY uq_distribution_broker (distribution_id, broker_id)
);
 
CREATE TABLE leads (
  id              CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,     -- store normalized: trim + lowercase
  phone           VARCHAR(50) NOT NULL,
  ip_address      VARCHAR(45) NOT NULL,      -- IPv4 or IPv6
  form_id         CHAR(36) NOT NULL,
  distribution_id CHAR(36) NULL,
  broker_id       CHAR(36) NULL,
  status          ENUM('sent', 'unsent', 'duplicate', 'failed') NOT NULL DEFAULT 'unsent',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_leads_form FOREIGN KEY (form_id) REFERENCES forms(id),
  CONSTRAINT fk_leads_distribution FOREIGN KEY (distribution_id) REFERENCES distributions(id),
  CONSTRAINT fk_leads_broker FOREIGN KEY (broker_id) REFERENCES brokers(id),
  INDEX idx_leads_email (email),
  INDEX idx_leads_status (status),
  INDEX idx_leads_broker_created (broker_id, created_at)
);