-- ============================================================================
-- supabase/seed.sql
-- Local dev seed data for Crelands.
-- Runs automatically after migrations on `supabase db reset`.
-- Safe to re-run: this file assumes a fresh reset (auth.users + public.users
-- start empty), so no ON CONFLICT handling is included on purpose — if you
-- need idempotent re-seeding without a reset, ask and I'll add that.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. AUTH USERS
-- public.users.id has a FK to auth.users.id, so every "user" must exist in
-- auth.users first. We insert directly into auth.users (allowed locally,
-- bypasses normal signup flow) which fires handle_new_user() and creates
-- the matching public.users row automatically via the trigger.
-- Password for every seed user is: password123
-- (bcrypt hash below corresponds to that password)
-- ----------------------------------------------------------------------------

INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
  -- Buyers
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'buyer1@test.local', extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"name":"Ananya Rao"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'buyer2@test.local', extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"name":"Rahul Mehta"}',
   now(), now(), '', '', '', ''),

  -- Sellers
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   'seller1@test.local', extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"name":"Priya Sharma"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   'seller2@test.local', extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"name":"Karthik Iyer"}',
   now(), now(), '', '', '', ''),

  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   'seller3@test.local', extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"name":"Fatima Sheikh"}',
   now(), now(), '', '', '', '');

-- The handle_new_user() trigger already created rows in public.users for the
-- 5 inserts above (using COALESCE on raw_user_meta_data ->> 'name' as
-- username, split_part(email,'@',1) as fallback). We now enrich those rows
-- with first/last name, seller flag, etc.

UPDATE public.users SET first_name = 'Ananya', last_name = 'Rao',   is_seller = false, role = 'buyer'  WHERE email = 'buyer1@test.local';
UPDATE public.users SET first_name = 'Rahul',  last_name = 'Mehta', is_seller = false, role = 'buyer'  WHERE email = 'buyer2@test.local';
UPDATE public.users SET first_name = 'Priya',  last_name = 'Sharma',is_seller = true,  role = 'seller' WHERE email = 'seller1@test.local';
UPDATE public.users SET first_name = 'Karthik',last_name = 'Iyer',  is_seller = true,  role = 'seller' WHERE email = 'seller2@test.local';
UPDATE public.users SET first_name = 'Fatima', last_name = 'Sheikh',is_seller = true,  role = 'seller' WHERE email = 'seller3@test.local';


-- ----------------------------------------------------------------------------
-- 2. ADDRESSES (one per buyer, so get_buyer_details / get_user_details_by_email work)
-- ----------------------------------------------------------------------------

INSERT INTO public.addresses (id, user_id, address_line1, address_line2, city, state, zip_code, country, is_default, phone)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '12 MG Road', 'Near City Mall', 'Coimbatore', 'Tamil Nadu', '641001', 'India', true, '+919876543210'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
   '45 Linking Road', 'Flat 3B', 'Mumbai', 'Maharashtra', '400050', 'India', true, '+919876543211');


-- ----------------------------------------------------------------------------
-- 3. CATEGORIES
-- search_vector is populated automatically by trigger_update_category_search_vector
-- ----------------------------------------------------------------------------

INSERT INTO public.categories (id, name, description, slug, image_url) VALUES
  ('40000000-0000-0000-0000-000000000001', 'Templates', 'Resume, presentation, and document templates for Indian creators.', 'templates', 'https://placehold.co/400x300?text=Templates'),
  ('40000000-0000-0000-0000-000000000002', 'Digital Art', 'Illustrations, wallpapers, and printable art.', 'digital-art', 'https://placehold.co/400x300?text=Digital+Art'),
  ('40000000-0000-0000-0000-000000000003', 'Fonts', 'Regional and Latin script font families.', 'fonts', 'https://placehold.co/400x300?text=Fonts'),
  ('40000000-0000-0000-0000-000000000004', 'Ebooks', 'Guides, novellas, and self-published books.', 'ebooks', 'https://placehold.co/400x300?text=Ebooks');


-- ----------------------------------------------------------------------------
-- 4. SELLERS (shops)
-- shop_logo has a UNIQUE constraint in your schema, so every value must be distinct.
-- ----------------------------------------------------------------------------

INSERT INTO public.sellers (id, user_id, shop_name, shop_description, shop_logo, shop_slug, rating, shop_banner, store_theme)
VALUES
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
   'Priya Designs', 'Minimal templates for resumes, pitch decks, and planners.',
   'https://placehold.co/200x200?text=PD', 'priya-designs', 5,
   'https://placehold.co/1200x300?text=Priya+Designs',
   '{"layout": "modern", "primaryColor": "#E8321A"}'),

  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002',
   'Karthik Art Studio', 'Digital illustrations and Madhubani-inspired prints.',
   'https://placehold.co/200x200?text=KA', 'karthik-art-studio', 4,
   'https://placehold.co/1200x300?text=Karthik+Art+Studio',
   '{"layout": "gallery", "primaryColor": "#0f172a"}'),

  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003',
   'Fatima Fonts & Books', 'Regional script fonts and self-published ebooks.',
   'https://placehold.co/200x200?text=FF', 'fatima-fonts-books', NULL,
   'https://placehold.co/1200x300?text=Fatima+Fonts', -- no rating yet — new seller, tests the "no reviews" path
   '{"layout": "modern", "primaryColor": "#166534"}');


-- ----------------------------------------------------------------------------
-- 5. SELLER BANK DETAILS
-- ----------------------------------------------------------------------------

INSERT INTO public.seller_bank_details (id, seller_id, account_holder_name, account_number, ifsc_code, phone, verification_status)
VALUES
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Priya Sharma', '123456789012', 'HDFC0001234', '+919876500001', 'SUCCESS'),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'Karthik Iyer', '234567890123', 'ICIC0005678', '+919876500002', 'PENDING'),
  ('60000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003', 'Fatima Sheikh', '345678901234', 'SBIN0009012', '+919876500003', 'REJECTED');


-- ----------------------------------------------------------------------------
-- 6. PRODUCTS
-- search_vector is populated automatically by trigger_update_product_search_vector
-- Prices in INR, no decimals needed but numeric(10,2) so .00 is fine.
-- ----------------------------------------------------------------------------

INSERT INTO public.products (id, name, price, description, category_id, stock, slug, seller_id) VALUES
  -- Priya Designs — Templates
  ('70000000-0000-0000-0000-000000000001', 'Minimal Resume Template Pack', 299.00,
   'A clean 3-page resume template pack in editable format, built for tech and design roles.',
   '40000000-0000-0000-0000-000000000001', 150, 'minimal-resume-template-pack', '50000000-0000-0000-0000-000000000001'),

  ('70000000-0000-0000-0000-000000000002', 'Startup Pitch Deck Template', 499.00,
   '18-slide pitch deck template with financial model placeholders, editable in Canva and PowerPoint.',
   '40000000-0000-0000-0000-000000000001', 80, 'startup-pitch-deck-template', '50000000-0000-0000-0000-000000000001'),

  ('70000000-0000-0000-0000-000000000003', 'Daily Planner Template', 149.00,
   'A printable and digital daily planner with habit tracker and monthly overview.',
   '40000000-0000-0000-0000-000000000001', 200, 'daily-planner-template', '50000000-0000-0000-0000-000000000001'),

  -- Karthik Art Studio — Digital Art
  ('70000000-0000-0000-0000-000000000004', 'Madhubani Wall Art Collection', 599.00,
   'Set of 5 high-resolution Madhubani-style illustrations, print-ready at A3.',
   '40000000-0000-0000-0000-000000000002', 60, 'madhubani-wall-art-collection', '50000000-0000-0000-0000-000000000002'),

  ('70000000-0000-0000-0000-000000000005', 'Monsoon Phone Wallpaper Pack', 99.00,
   '10 mobile wallpapers inspired by the Indian monsoon, in 4K resolution.',
   '40000000-0000-0000-0000-000000000002', 500, 'monsoon-phone-wallpaper-pack', '50000000-0000-0000-0000-000000000002'),

  ('70000000-0000-0000-0000-000000000006', 'Festival Illustration Bundle', 799.00,
   'Diwali, Holi, and Pongal illustration set for social media and print use.',
   '40000000-0000-0000-0000-000000000002', 40, 'festival-illustration-bundle', '50000000-0000-0000-0000-000000000002'),

  -- Fatima Fonts & Books — Fonts + Ebooks
  ('70000000-0000-0000-0000-000000000007', 'Devanagari Display Font Bundle', 399.00,
   '4-weight Devanagari display typeface family, ideal for branding and headlines.',
   '40000000-0000-0000-0000-000000000003', 100, 'devanagari-display-font-bundle', '50000000-0000-0000-0000-000000000003'),

  ('70000000-0000-0000-0000-000000000008', 'Freelancing in India: A Practical Guide', 249.00,
   '120-page ebook covering GST, contracts, and pricing for Indian freelancers.',
   '40000000-0000-0000-0000-000000000004', 300, 'freelancing-in-india-practical-guide', '50000000-0000-0000-0000-000000000003');


-- ----------------------------------------------------------------------------
-- 7. PRODUCT IMAGES (2 per product — tests carousel/multi-image rendering)
-- ----------------------------------------------------------------------------

INSERT INTO public.product_images (product_id, image_url, alt_text) VALUES
  ('70000000-0000-0000-0000-000000000001', 'https://placehold.co/600x400?text=Resume+1', 'Resume template page 1'),
  ('70000000-0000-0000-0000-000000000001', 'https://placehold.co/600x400?text=Resume+2', 'Resume template page 2'),

  ('70000000-0000-0000-0000-000000000002', 'https://placehold.co/600x400?text=Pitch+Deck+1', 'Pitch deck cover slide'),
  ('70000000-0000-0000-0000-000000000002', 'https://placehold.co/600x400?text=Pitch+Deck+2', 'Pitch deck financials slide'),

  ('70000000-0000-0000-0000-000000000003', 'https://placehold.co/600x400?text=Planner+1', 'Daily planner front page'),
  ('70000000-0000-0000-0000-000000000003', 'https://placehold.co/600x400?text=Planner+2', 'Daily planner habit tracker'),

  ('70000000-0000-0000-0000-000000000004', 'https://placehold.co/600x400?text=Madhubani+1', 'Madhubani art piece 1'),
  ('70000000-0000-0000-0000-000000000004', 'https://placehold.co/600x400?text=Madhubani+2', 'Madhubani art piece 2'),

  ('70000000-0000-0000-0000-000000000005', 'https://placehold.co/600x400?text=Wallpaper+1', 'Monsoon wallpaper 1'),
  ('70000000-0000-0000-0000-000000000005', 'https://placehold.co/600x400?text=Wallpaper+2', 'Monsoon wallpaper 2'),

  ('70000000-0000-0000-0000-000000000006', 'https://placehold.co/600x400?text=Festival+1', 'Diwali illustration'),
  ('70000000-0000-0000-0000-000000000006', 'https://placehold.co/600x400?text=Festival+2', 'Holi illustration'),

  ('70000000-0000-0000-0000-000000000007', 'https://placehold.co/600x400?text=Font+Specimen+1', 'Font specimen sheet'),
  ('70000000-0000-0000-0000-000000000007', 'https://placehold.co/600x400?text=Font+Specimen+2', 'Font weights comparison'),

  ('70000000-0000-0000-0000-000000000008', 'https://placehold.co/600x400?text=Ebook+Cover', 'Ebook cover'),
  ('70000000-0000-0000-0000-000000000008', 'https://placehold.co/600x400?text=Ebook+Sample+Page', 'Ebook sample page');


-- ----------------------------------------------------------------------------
-- 8. PRODUCT FILES (the actual downloadable deliverable — 1 per product)
-- get_orders() / get_shop_products() both LEFT JOIN or JOIN on this table.
-- ----------------------------------------------------------------------------

INSERT INTO public.product_files (product_id, file_url) VALUES
  ('70000000-0000-0000-0000-000000000001', 'https://files.example.local/dev/resume-template-pack.zip'),
  ('70000000-0000-0000-0000-000000000002', 'https://files.example.local/dev/pitch-deck-template.pptx'),
  ('70000000-0000-0000-0000-000000000003', 'https://files.example.local/dev/daily-planner.pdf'),
  ('70000000-0000-0000-0000-000000000004', 'https://files.example.local/dev/madhubani-collection.zip'),
  ('70000000-0000-0000-0000-000000000005', 'https://files.example.local/dev/monsoon-wallpapers.zip'),
  ('70000000-0000-0000-0000-000000000006', 'https://files.example.local/dev/festival-bundle.zip'),
  ('70000000-0000-0000-0000-000000000007', 'https://files.example.local/dev/devanagari-fonts.zip');
  -- Note: product 8 (ebook) intentionally has NO file row yet —
  -- tests the "seller hasn't uploaded deliverable" edge case.


-- ----------------------------------------------------------------------------
-- 9. CART (buyer1 has an active cart with 2 items; buyer2 has no cart at all —
-- tests the "new user, no cart" path)
-- ----------------------------------------------------------------------------

INSERT INTO public.carts (id, user_id) VALUES
  ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');

INSERT INTO public.cart_items (cart_id, product_id, quantity) VALUES
  ('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000004', 1),
  ('80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000007', 2);


-- ----------------------------------------------------------------------------
-- 10. ORDERS, ORDER ITEMS, SELLER_ORDERS, PAYMENTS
-- One completed order for buyer2, split across two different sellers'
-- products in the same order — tests multi-seller order fan-out via
-- seller_orders and get_seller_orders().
-- ----------------------------------------------------------------------------

-- total_amount = 299 (Priya) + 99 (Karthik) + 249 (Fatima) = 647.00
INSERT INTO public.orders (id, user_id, total_amount) VALUES
  ('90000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 647.00);

INSERT INTO public.order_items (id, order_id, product_id, quantity, price) VALUES
  ('a1000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 1, 299.00), -- Priya's product
  ('a1000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000005', 1, 99.00),  -- Karthik's product
  ('a1000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000008', 1, 249.00); -- Fatima's product (no file yet, per above)

INSERT INTO public.seller_orders (seller_id, order_id) VALUES
  ('50000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001'), -- Priya
  ('50000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001'), -- Karthik
  ('50000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001'); -- Fatima

INSERT INTO public.payments (order_id, user_id, amount, payment_method, status, transaction_id) VALUES
  ('90000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 647.00, 'UPI', 'Success', 'txn_dev_00000001');


-- ----------------------------------------------------------------------------
-- 11. PAYOUTS (one payout already issued to Priya for the above order)
-- ----------------------------------------------------------------------------

INSERT INTO public.payouts (seller_id, amount) VALUES
  ('50000000-0000-0000-0000-000000000001', 299.00);


-- ----------------------------------------------------------------------------
-- 12. REVIEWS (buyer2 reviews the two products they actually bought)
-- ----------------------------------------------------------------------------

INSERT INTO public.reviews (product_id, user_id, seller_id, rating, comment) VALUES
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001',
   5, 'Super clean template, saved me hours formatting my resume.'),
  ('70000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002',
   4, 'Lovely wallpapers, though I wish there were a couple more dark-mode options.');


-- ----------------------------------------------------------------------------
-- 13. LEADS (waitlist / newsletter signups — unrelated to the buyer/seller flow)
-- ----------------------------------------------------------------------------

INSERT INTO public.leads (email) VALUES
  ('interested.creator@test.local'),
  ('curious.buyer@test.local');


-- ----------------------------------------------------------------------------
-- 14. BLOGPOSTS
-- ----------------------------------------------------------------------------

INSERT INTO public.blogposts (title, slug, cover_image, content, category, published_status, description) VALUES
  ('5 Tips for Indian Creators Selling Digital Products', '5-tips-indian-creators-selling-digital-products',
   'https://placehold.co/800x400?text=Blog+Cover',
   'Full article content would go here — pricing in INR, UPI payment trust signals, and building a niche audience before you launch.',
   'Growth', true, 'A short guide for creators just getting started on Crelands.');