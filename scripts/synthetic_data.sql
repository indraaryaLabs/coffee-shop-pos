-- Realistic synthetic data for The Atelier POS
-- Execute this directly in your Supabase SQL editor.
-- Note: This is an additive script. If you already have data, this will add to it without conflicts because it uses fixed, unique UUIDs.

-----------------------------------------------------------
-- 1. Create Staff / Users
-----------------------------------------------------------
INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at) 
VALUES 
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Julian V.', 'julian@theatelier.com', true, 'admin', NOW() - INTERVAL '30 days', NOW()),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'Elena M.', 'elena@theatelier.com', true, 'barista', NOW() - INTERVAL '15 days', NOW()),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Sasha M.', 'sasha@theatelier.com', true, 'barista', NOW() - INTERVAL '10 days', NOW())
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 2. Create Products (Raw Materials)
-----------------------------------------------------------
INSERT INTO "products" (id, name, description, price, category, type, image_url, created_at)
VALUES
  ('b1b2c3d4-0000-0000-0000-000000000010', 'Robusta Beans (1kg)', 'Premium Robusta for signature espresso', 15.00, 'Beans', 'raw_material', NULL, NOW() - INTERVAL '30 days'),
  ('b1b2c3d4-0000-0000-0000-000000000011', 'Fresh Milk (1L)', 'Whole pasteurized milk', 2.50, 'Dairy', 'raw_material', NULL, NOW() - INTERVAL '30 days'),
  ('b1b2c3d4-0000-0000-0000-000000000012', 'Gula Aren Syrup (1L)', 'Authentic Indonesian palm sugar syrup', 4.00, 'Syrup', 'raw_material', NULL, NOW() - INTERVAL '30 days'),
  ('b1b2c3d4-0000-0000-0000-000000000013', 'Premium Vanilla Syrup (1L)', 'Madagascar vanilla extract', 8.50, 'Syrup', 'raw_material', NULL, NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 3. Create Products (Retail / Pastries)
-----------------------------------------------------------
INSERT INTO "products" (id, name, description, price, category, type, image_url, created_at)
VALUES
  ('b1b2c3d4-0000-0000-0000-000000000020', 'Butter Croissant', 'Flaky butter croissant baked daily', 3.50, 'Pastry', 'retail', NULL, NOW() - INTERVAL '20 days'),
  ('b1b2c3d4-0000-0000-0000-000000000021', 'Atelier Tumbler', 'Stainless steel double wall tumbler 500ml', 25.00, 'Merchandise', 'retail', NULL, NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 4. Create Products (Menu Items)
-----------------------------------------------------------
INSERT INTO "products" (id, name, description, price, category, type, image_url, created_at)
VALUES
  ('b1b2c3d4-0000-0000-0000-000000000030', 'Kopi Susu Gula Aren', 'Perpaduan kopi robusta pilihan dengan gula aren asli', 4.50, 'Coffee', 'menu', NULL, NOW() - INTERVAL '15 days'),
  ('b1b2c3d4-0000-0000-0000-000000000031', 'Coffee Latte', 'Espresso shot dengan steamed milk lembut', 5.00, 'Coffee', 'menu', NULL, NOW() - INTERVAL '15 days'),
  ('b1b2c3d4-0000-0000-0000-000000000032', 'Vanilla Latte', 'Latte klasik dengan vanilla premium', 5.50, 'Coffee', 'menu', NULL, NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 5. Inventory Items (Linking Raw Materials & Retail)
-----------------------------------------------------------
INSERT INTO "inventory" (id, product_id, current_stock, unit, supplier, status, last_restocked)
VALUES
  ('c1b2c3d4-0000-0000-0000-000000000010', 'b1b2c3d4-0000-0000-0000-000000000010', 50, 'grams', 'Local Roasters', 'in_stock', NOW()),
  ('c1b2c3d4-0000-0000-0000-000000000011', 'b1b2c3d4-0000-0000-0000-000000000011', 20, 'ml', 'Dairy Farms Inc', 'in_stock', NOW()),
  ('c1b2c3d4-0000-0000-0000-000000000012', 'b1b2c3d4-0000-0000-0000-000000000012', 3, 'ml', 'Artisan Syrups', 'low_stock', NOW() - INTERVAL '5 days'),
  ('c1b2c3d4-0000-0000-0000-000000000020', 'b1b2c3d4-0000-0000-0000-000000000020', 12, 'pcs', 'In-house Bakery', 'in_stock', NOW() - INTERVAL '1 day'),
  ('c1b2c3d4-0000-0000-0000-000000000021', 'b1b2c3d4-0000-0000-0000-000000000021', 0, 'pcs', 'Merch Co', 'out_of_stock', NOW() - INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 6. Recipe Mappings (Menu Items to Raw Materials)
-----------------------------------------------------------
-- Kopi Susu Gula Aren: requires Beans, Milk, Gula Aren
INSERT INTO "recipe_ingredients" (id, menu_product_id, raw_material_id, quantity_needed, unit)
VALUES
  ('d1b2c3d4-0000-0000-0000-000000000001', 'b1b2c3d4-0000-0000-0000-000000000030', 'b1b2c3d4-0000-0000-0000-000000000010', 18, 'grams'),
  ('d1b2c3d4-0000-0000-0000-000000000002', 'b1b2c3d4-0000-0000-0000-000000000030', 'b1b2c3d4-0000-0000-0000-000000000011', 150, 'ml'),
  ('d1b2c3d4-0000-0000-0000-000000000003', 'b1b2c3d4-0000-0000-0000-000000000030', 'b1b2c3d4-0000-0000-0000-000000000012', 20, 'ml')
ON CONFLICT (id) DO NOTHING;

-- Coffee Latte: requires Beans, Milk
INSERT INTO "recipe_ingredients" (id, menu_product_id, raw_material_id, quantity_needed, unit)
VALUES
  ('d1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000031', 'b1b2c3d4-0000-0000-0000-000000000010', 18, 'grams'),
  ('d1b2c3d4-0000-0000-0000-000000000005', 'b1b2c3d4-0000-0000-0000-000000000031', 'b1b2c3d4-0000-0000-0000-000000000011', 200, 'ml')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 7. Transactions (Historical data spread across last 7 days)
-----------------------------------------------------------
INSERT INTO "transactions" (id, cashier_id, total_amount, payment_method, status, customer_name, table_number, created_at)
VALUES
  ('e1b2c3d4-0000-0000-0000-000000000001', 'a1b2c3d4-0000-0000-0000-000000000002', 12.50, 'card', 'completed', 'Marcus Thorne', 'T1', NOW() - INTERVAL '1 day'),
  ('e1b2c3d4-0000-0000-0000-000000000002', 'a1b2c3d4-0000-0000-0000-000000000003', 4.50, 'cash', 'completed', 'Guest', 'Takeaway', NOW() - INTERVAL '2 days'),
  ('e1b2c3d4-0000-0000-0000-000000000003', 'a1b2c3d4-0000-0000-0000-000000000001', 8.50, 'qr_code', 'completed', 'Sarah Jennings', 'T4', NOW() - INTERVAL '3 days'),
  ('e1b2c3d4-0000-0000-0000-000000000004', 'a1b2c3d4-0000-0000-0000-000000000002', 17.50, 'card', 'completed', 'David Chen', 'T2', NOW() - INTERVAL '4 days'),
  ('e1b2c3d4-0000-0000-0000-000000000005', 'a1b2c3d4-0000-0000-0000-000000000003', 5.00, 'cash', 'completed', 'Guest', 'Takeaway', NOW() - INTERVAL '5 days'),
  ('e1b2c3d4-0000-0000-0000-000000000006', 'a1b2c3d4-0000-0000-0000-000000000001', 9.00, 'card', 'completed', 'Aisha Romero', 'T3', NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------
-- 8. Transaction Items (Linking specific items to receipts)
-----------------------------------------------------------
INSERT INTO "transaction_items" (id, transaction_id, product_id, quantity, price_at_time)
VALUES
  -- Trans 1: 2x Kopi Susu, 1x Croissant ($9.00 + $3.50 = 12.50)
  ('f1b2c3d4-0000-0000-0000-000000000001', 'e1b2c3d4-0000-0000-0000-000000000001', 'b1b2c3d4-0000-0000-0000-000000000030', 2, 4.50),
  ('f1b2c3d4-0000-0000-0000-000000000002', 'e1b2c3d4-0000-0000-0000-000000000001', 'b1b2c3d4-0000-0000-0000-000000000020', 1, 3.50),
  
  -- Trans 2: 1x Kopi Susu ($4.50)
  ('f1b2c3d4-0000-0000-0000-000000000003', 'e1b2c3d4-0000-0000-0000-000000000002', 'b1b2c3d4-0000-0000-0000-000000000030', 1, 4.50),

  -- Trans 3: 1x Coffee Latte, 1x Butter Croissant ($5.00 + $3.50 = 8.50)
  ('f1b2c3d4-0000-0000-0000-000000000004', 'e1b2c3d4-0000-0000-0000-000000000003', 'b1b2c3d4-0000-0000-0000-000000000031', 1, 5.00),
  ('f1b2c3d4-0000-0000-0000-000000000005', 'e1b2c3d4-0000-0000-0000-000000000003', 'b1b2c3d4-0000-0000-0000-000000000020', 1, 3.50),

  -- Trans 4: 1x Tumbler, 1x Coffee Latte, 1x Croissant ($25.00? Wait, price was 17.50. Let's do 2x Vanilla Latte, 2x Croissant = 11 + 7 = 18.00. I'll adjust the trans 4 row above to match the items here or vice versa. Let's match items to the math: 2x Vanilla Latte ($11.00) + 1x Kopi Susu ($4.50) = 15.50 + 2.00? I'll just change the transaction items to match 17.50)
  -- 2x Vanilla Latte = 11.00, 1x Kopi Susu = 4.50, Total 15.50. Plus 2.00? Let's just make it 3x Vanilla Latte = 16.50 + 1.00? No, let's do 1x Vanilla Latte (5.50) + 2x Kopi Susu (9.00) + 1x Croissant (3.00 if discounted, or just fix the query math). Let's do 1x Kopi Susu (4.50) + 1x Coffee Latte (5.00) + 1x Vanilla Latte (5.50) + 1x Croissant (2.50 discount) = 17.50.
  ('f1b2c3d4-0000-0000-0000-000000000006', 'e1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000030', 2, 4.50), -- 9.00
  ('f1b2c3d4-0000-0000-0000-000000000007', 'e1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000031', 1, 5.00), -- 5.00
  ('f1b2c3d4-0000-0000-0000-000000000008', 'e1b2c3d4-0000-0000-0000-000000000004', 'b1b2c3d4-0000-0000-0000-000000000020', 1, 3.50), -- 3.50. Total = 17.50

  -- Trans 5: 1x Coffee Latte ($5.00)
  ('f1b2c3d4-0000-0000-0000-000000000009', 'e1b2c3d4-0000-0000-0000-000000000005', 'b1b2c3d4-0000-0000-0000-000000000031', 1, 5.00),
  
  -- Trans 6: 2x Kopi Susu Gula Aren ($9.00)
  ('f1b2c3d4-0000-0000-0000-000000000010', 'e1b2c3d4-0000-0000-0000-000000000006', 'b1b2c3d4-0000-0000-0000-000000000030', 2, 4.50)
ON CONFLICT (id) DO NOTHING;

-- (End of Script)
