
-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin login: admin@example.com / Admin123!
INSERT INTO users (email, password, name)
VALUES ('admin@example.com', '$2b$10$dJ2CziW2pDwrUhYkgTEqvOfmymxsBVyluXTqukCevGW.I22eyU3yC', 'Admin');
 
-- Brokers: 3 active with different timezones/hours (to exercise eligibility logic),
-- 1 inactive (to test that inactive brokers get skipped).
INSERT INTO brokers (name, is_active, daily_cap, timezone, opening_time, closing_time, working_days) VALUES
('Broker A - Manila',              TRUE,  10, 'Asia/Manila',       '09:00', '18:00', '1,2,3,4,5'),
('Broker B - New York',            TRUE,  8,  'America/New_York',  '08:00', '17:00', '1,2,3,4,5'),
('Broker C - London',              TRUE,  5,  'Europe/London',     '09:00', '17:30', '1,2,3,4,5,6'),
('Broker D - Inactive (testing)',  FALSE, 10, 'Asia/Manila',       '09:00', '18:00', '1,2,3,4,5');
 
-- One form
INSERT INTO forms (name, slug) VALUES ('Lead Registration', 'lead-registration');
 
-- One distribution, linked to the form above
INSERT INTO distributions (form_id)
SELECT id FROM forms WHERE slug = 'lead-registration';
 
-- Distribution brokers: 50/30/20 split across the 3 active brokers,
-- matching the worked example in the exam spec.
INSERT INTO distribution_brokers (distribution_id, broker_id, percentage, is_active)
SELECT d.id, b.id, pct.percentage, TRUE
FROM distributions d
JOIN forms f ON f.id = d.form_id AND f.slug = 'lead-registration'
JOIN (
  SELECT 'Broker A - Manila'   AS name, 50 AS percentage
  UNION ALL SELECT 'Broker B - New York', 30
  UNION ALL SELECT 'Broker C - London', 20
) pct ON TRUE
JOIN brokers b ON b.name = pct.name;