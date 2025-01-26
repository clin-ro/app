-- Insert categories for automotive care
INSERT INTO categories (name, slug, image_url) VALUES
('Spălătorie auto', 'spalatorie-auto', '/images/categories/car-wash.jpg'),
('Detailing auto', 'detailing-auto', '/images/categories/car-detailing.jpg'),
('Vulcanizare', 'vulcanizare', '/images/categories/tire-service.jpg'),
('Mecanică auto', 'mecanica-auto', '/images/categories/auto-mechanic.jpg'),
('Tinichigerie și vopsitorie', 'tinichigerie-vopsitorie', '/images/categories/body-paint.jpg'),
('Electrică auto', 'electrica-auto', '/images/categories/auto-electric.jpg'),
('Polish faruri', 'polish-faruri', '/images/categories/headlight-polish.jpg'),
('Întreținere AC auto', 'intretinere-ac-auto', '/images/categories/ac-service.jpg');

-- Insert mock data for users
INSERT INTO users (email, phone, first_name, last_name, image_url)
SELECT
  'user' || generate_series || '@example.com',
  '+407' || lpad(generate_series::text, 8, '0'),
  (ARRAY['Ion', 'Maria', 'Andrei', 'Elena', 'Mihai', 'Ana', 'Cristian', 'Ioana', 'Alexandru', 'Gabriela'])[floor(random() * 10 + 1)],
  (ARRAY['Popescu', 'Ionescu', 'Popa', 'Constantinescu', 'Stan', 'Gheorghe', 'Rusu', 'Munteanu', 'Matei', 'Diaconu'])[floor(random() * 10 + 1)],
  '/images/users/user' || generate_series || '.jpg'
FROM generate_series(1, 100);

-- Insert mock data for providers
INSERT INTO providers (name, slug, description, address, city, logo_url, image_url, rating, reviews_count, category_id, promoted, promotion_start_date, promotion_end_date)
SELECT
  'Auto ' || (ARRAY['Lux', 'Star', 'Pro', 'Expert', 'Top', 'Elite', 'Master', 'Rapid', 'Eco', 'Tech'])[floor(random() * 10 + 1)] || ' ' || city,
  lower(replace('auto-' || (ARRAY['Lux', 'Star', 'Pro', 'Expert', 'Top', 'Elite', 'Master', 'Rapid', 'Eco', 'Tech'])[floor(random() * 10 + 1)] || '-' || city, ' ', '-')),
  'Servicii auto de înaltă calitate în ' || city,
  'Strada ' || (ARRAY['Mihai Viteazu', 'Stefan cel Mare', 'Decebal', 'Traian', 'Avram Iancu', 'Tudor Vladimirescu', 'Nicolae Balcescu', 'Unirii', 'Independentei', 'Libertatii'])[floor(random() * 10 + 1)] || ' ' || floor(random() * 100 + 1)::text,
  city,
  '/images/logos/auto-' || lower(replace((ARRAY['Lux', 'Star', 'Pro', 'Expert', 'Top', 'Elite', 'Master', 'Rapid', 'Eco', 'Tech'])[floor(random() * 10 + 1)], ' ', '-')) || '.png',
  '/images/providers/auto-' || lower(replace((ARRAY['Lux', 'Star', 'Pro', 'Expert', 'Top', 'Elite', 'Master', 'Rapid', 'Eco', 'Tech'])[floor(random() * 10 + 1)], ' ', '-')) || '.jpg',
  4 + random(),
  floor(random() * 500 + 50),
  (SELECT id FROM categories ORDER BY random() LIMIT 1),
  random() < 0.2,
  CASE WHEN random() < 0.2 THEN current_date ELSE NULL END,
  CASE WHEN random() < 0.2 THEN current_date + interval '30 days' ELSE NULL END
FROM (VALUES ('București'), ('Cluj-Napoca'), ('Timișoara'), ('Iași'), ('Constanța'), ('Craiova'), ('Brașov'), ('Galați'), ('Ploiești'), ('Oradea')) AS cities(city),
     generate_series(1, 5);

-- Insert mock data for services
INSERT INTO services (provider_id, name, slug, description, price, discount_price, duration)
SELECT
  p.id,
  s.name,
  lower(replace(s.name, ' ', '-')),
  s.description,
  s.base_price + floor(random() * 50)::decimal,
  CASE WHEN random() < 0.3 THEN (s.base_price + floor(random() * 50)::decimal) * 0.8 ELSE NULL END,
  s.duration
FROM providers p
CROSS JOIN (
  VALUES
    ('Spălare exterioară', 'Spălare completă a exteriorului mașinii', 30.00, 30),
    ('Spălare interioară', 'Curățare detaliată a interiorului mașinii', 50.00, 45),
    ('Polish caroserie', 'Polish profesional pentru caroserie', 200.00, 120),
    ('Curățare tapițerie', 'Curățare profundă a tapițeriei', 150.00, 90),
    ('Schimb anvelope', 'Schimb și echilibrare anvelope', 80.00, 60),
    ('Revizie tehnică', 'Revizie tehnică completă', 250.00, 120),
    ('Schimb ulei și filtre', 'Schimb ulei motor și toate filtrele', 150.00, 60),
    ('Reparație frâne', 'Verificare și reparație sistem de frânare', 180.00, 90),
    ('Diagnoza electronică', 'Verificare computerizată a sistemelor electronice', 100.00, 45),
    ('Încărcare AC', 'Verificare și reîncărcare sistem AC', 120.00, 60),
    ('Vopsire element caroserie', 'Vopsire profesională element caroserie', 300.00, 180),
    ('Redresare tablă', 'Îndreptare tablă fără revopsire', 200.00, 120),
    ('Polish faruri', 'Restaurare faruri prin polish profesional', 80.00, 60),
    ('Schimb baterie', 'Schimb baterie auto', 60.00, 30),
    ('Reglare geometrie', 'Verificare și reglare geometrie roți', 120.00, 60)
) AS s(name, description, base_price, duration);

-- Insert mock data for specialists
INSERT INTO specialists (provider_id, name, slug, role, image_url)
SELECT
  p.id,
  (ARRAY['Ion', 'Mihai', 'Andrei', 'Cristian', 'Alexandru', 'George', 'Marian', 'Florin', 'Bogdan', 'Cătălin'])[floor(random() * 10 + 1)] || ' ' ||
  (ARRAY['Popescu', 'Ionescu', 'Popa', 'Stan', 'Gheorghe', 'Rusu', 'Munteanu', 'Matei', 'Diaconu', 'Nistor'])[floor(random() * 10 + 1)],
  lower(replace(
    (ARRAY['Ion', 'Mihai', 'Andrei', 'Cristian', 'Alexandru', 'George', 'Marian', 'Florin', 'Bogdan', 'Cătălin'])[floor(random() * 10 + 1)] || '-' ||
    (ARRAY['Popescu', 'Ionescu', 'Popa', 'Stan', 'Gheorghe', 'Rusu', 'Munteanu', 'Matei', 'Diaconu', 'Nistor'])[floor(random() * 10 + 1)],
  ' ', '-')),
  (ARRAY['Mecanic auto', 'Specialist detailing', 'Tinichigiu', 'Electrician auto', 'Vopsitor auto', 'Tehnician AC', 'Vulcanizator', 'Specialist diagnoza', 'Specialist polish', 'Tehnician geometrie'])[floor(random() * 10 + 1)],
  '/images/specialists/specialist-' || generate_series || '.jpg'
FROM providers p
CROSS JOIN generate_series(1, 5);

-- Insert mock data for specialist_services
INSERT INTO specialist_services (specialist_id, service_id)
SELECT s.id, ser.id
FROM specialists s
JOIN services ser ON s.provider_id = ser.provider_id
WHERE random() < 0.7;

-- Insert mock data for appointments
INSERT INTO appointments (user_id, service_id, specialist_id, provider_id, appointment_date, appointment_time, end_time, status)
SELECT
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  ser.id,
  s.id,
  p.id,
  current_date + (random() * 30 + 1)::integer,
  (TIME '09:00:00' + (random() * 540)::integer * interval '1 minute')::time,
  (TIME '09:00:00' + (random() * 540 + ser.duration)::integer * interval '1 minute')::time,
  (ARRAY['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])[floor(random() * 5 + 1)]::appointment_status
FROM providers p
JOIN services ser ON p.id = ser.provider_id
JOIN specialists s ON p.id = s.provider_id
CROSS JOIN generate_series(1, 1000);

-- Insert mock data for reviews
INSERT INTO reviews (user_id, provider_id, rating, comment)
SELECT
  (SELECT id FROM users ORDER BY random() LIMIT 1),
  p.id,
  floor(random() * 5 + 1),
  (ARRAY[
    'Servicii excelente, recomand cu încredere!',
    'Personalul este foarte profesionist și prietenos.',
    'Prețuri corecte pentru calitatea oferită.',
    'Am rămas impresionat de atenția la detalii.',
    'Timpul de așteptare a fost mai lung decât mă așteptam.',
    'Cea mai bună experiență de îngrijire auto din oraș!',
    'Serviciu prompt și eficient, voi reveni cu siguranță.',
    'Rezultate peste așteptări, mașina arată ca nouă.',
    'Apreciez sfaturile utile oferite de specialiști.',
    'Puțin cam scump, dar calitatea serviciilor justifică prețul.'
  ])[floor(random() * 10 + 1)]
FROM providers p
CROSS JOIN generate_series(1, 2000);

-- Insert mock data for favorites
INSERT INTO favorites (user_id, provider_id)
SELECT
  u.id,
  p.id
FROM users u
CROSS JOIN providers p
WHERE random() < 0.1;

-- Insert mock data for provider_gallery
INSERT INTO provider_gallery (provider_id, url, title)
SELECT
  p.id,
  '/images/gallery/auto-' || generate_series || '.jpg',
  (ARRAY['Exterior curat', 'Interior impecabil', 'Lucrări de detailing', 'Echipă la lucru', 'Rezultate uimitoare', 'Înainte și după', 'Tehnologie avansată', 'Clienți mulțumiți'])[floor(random() * 8 + 1)]
FROM providers p
CROSS JOIN generate_series(1, 10);

-- Insert mock data for working_hours
INSERT INTO working_hours (provider_id, day_of_week, open_time, close_time, is_closed)
SELECT
  p.id,
  day,
  CASE 
    WHEN day BETWEEN 1 AND 5 THEN '08:00'::time
    WHEN day = 6 THEN '09:00'::time
    ELSE '10:00'::time
  END,
  CASE 
    WHEN day BETWEEN 1 AND 5 THEN '20:00'::time
    WHEN day = 6 THEN '18:00'::time
    ELSE '16:00'::time
  END,
  CASE WHEN day = 0 AND random() < 0.3 THEN true ELSE false END
FROM providers p
CROSS JOIN generate_series(0, 6) AS day;

-- Update provider ratings based on reviews
UPDATE providers
SET rating = subquery.avg_rating,
    reviews_count = subquery.review_count
FROM (
    SELECT provider_id, 
           ROUND(AVG(rating)::numeric, 2) as avg_rating,
           COUNT(*) as review_count
    FROM reviews
    GROUP BY provider_id
) AS subquery
WHERE providers.id = subquery.provider_id;

-- Insert mock data for gift_cards
INSERT INTO gift_cards (code, provider_id, purchaser_id, recipient_email, amount, balance, valid_from, valid_until, is_active)
SELECT
  'GIFT' || lpad(generate_series::text, 8, '0'),
  p.id,
  u.id,
  'recipient' || generate_series || '@example.com',
  (random() * 400 + 100)::decimal(10,2),
  (random() * 400 + 100)::decimal(10,2),
  current_date - (random() * 30)::integer,
  current_date + (random() * 365)::integer,
  random() < 0.9
FROM providers p
CROSS JOIN users u
CROSS JOIN generate_series(1, 500)
ORDER BY random()
LIMIT 500;

-- Insert mock data for special_hours (holidays, special events)
INSERT INTO special_hours (provider_id, date, open_time, close_time, is_closed, reason)
SELECT
  p.id,
  current_date + (random() * 365)::integer,
  CASE WHEN random() < 0.5 THEN '10:00'::time ELSE NULL END,
  CASE WHEN random() < 0.5 THEN '16:00'::time ELSE NULL END,
  random() < 0.7,
  CASE 
    WHEN random() < 0.3 THEN 'Sărbătoare națională'
    WHEN random() < 0.6 THEN 'Renovări'
    ELSE 'Event special'
  END
FROM providers p
CROSS JOIN generate_series(1, 3);

