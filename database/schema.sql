-- Lost and Found: PostgreSQL schema (safe to run more than once)
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  student_id  VARCHAR(30)  NOT NULL UNIQUE,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(100) NOT NULL,
  role        VARCHAR(10)  NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,
  type          VARCHAR(5)   NOT NULL CHECK (type IN ('lost','found')),
  title         VARCHAR(120) NOT NULL,
  category      VARCHAR(30)  NOT NULL,
  description   TEXT         NOT NULL,
  location      VARCHAR(150) NOT NULL,
  date_event    DATE         NOT NULL,
  image         VARCHAR(255),
  status        VARCHAR(10)  NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected','claimed','returned')),
  reject_reason TEXT,
  reported_by   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
  id          SERIAL PRIMARY KEY,
  item_id     INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  claimant_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proof       TEXT NOT NULL,
  status      VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note  TEXT,
  reviewed_by INT REFERENCES users(id),
  returned_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (item_id, claimant_id)            -- one claim per student per item
);

CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  type       VARCHAR(20) NOT NULL DEFAULT 'info',
  link       VARCHAR(200),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_status   ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_reporter ON items(reported_by);
CREATE INDEX IF NOT EXISTS idx_claims_item    ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_notif_user     ON notifications(user_id, is_read);
