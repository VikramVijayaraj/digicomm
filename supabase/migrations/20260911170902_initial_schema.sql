


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "neon_auth";


ALTER SCHEMA "neon_auth" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_cart_user_by_email"("user_email" "text") RETURNS "uuid"
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$
  WITH inserted AS (
    INSERT INTO public.carts (user_id)
    SELECT id FROM public.users WHERE email = user_email
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id
  )
  SELECT id FROM inserted
  UNION ALL
  SELECT id FROM public.carts WHERE user_id = (SELECT id FROM public.users WHERE email = user_email)
  LIMIT 1;
$$;


ALTER FUNCTION "public"."create_cart_user_by_email"("user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_avg_product_rating"("p_product_slug" "text") RETURNS TABLE("product_id" "uuid", "product_name" "text", "avg_rating" numeric, "total_reviews" bigint)
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$

SELECT
  p.id AS product_id,
  p.name AS product_name,
  ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
  COUNT(r.id) AS total_reviews
FROM public.products p
LEFT JOIN public.reviews r ON p.id = r.product_id
WHERE p.slug = p_product_slug
GROUP BY p.id, p.name;
$$;


ALTER FUNCTION "public"."get_avg_product_rating"("p_product_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_avg_shop_rating"("p_shop_slug" "text") RETURNS TABLE("id" "uuid", "shop_name" "text", "avg_rating" numeric, "total_reviews" bigint)
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$

SELECT
  s.id,
  s.shop_name,
  ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating,
  COUNT(r.id) AS total_reviews
FROM public.sellers s
LEFT JOIN public.reviews r ON s.id = r.seller_id
WHERE s.shop_slug = p_shop_slug
GROUP BY s.id, s.shop_name;
$$;


ALTER FUNCTION "public"."get_avg_shop_rating"("p_shop_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_buyer_details"("p_order_id" "uuid", "p_item_id" "uuid") RETURNS TABLE("product_name" "text", "product_slug" "text", "quantity" integer, "price" numeric, "order_date" timestamp with time zone, "product_image" "text", "full_name" "text", "email" "text", "address" "text", "phone" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT
    p.name AS product_name,
    p.slug AS product_slug,
    oi.quantity,
    oi.price,
    o.created_at AS order_date,
    pi.image_url AS product_image,
    u.first_name || ' ' || u.last_name AS full_name,
    u.email,
    -- This safely concatenates the address, ignoring null parts
    TRIM(BOTH ', ' FROM COALESCE(a.address_line1, '') || ', ' || 
    COALESCE(a.address_line2, '') || ', ' || 
    COALESCE(a.city, '') || ', ' || 
    COALESCE(a.state, '') || ', ' || 
    COALESCE(a.country, '') || ', ' || 
    COALESCE(a.zip_code, '')) AS address,
    a.phone
  FROM public.orders o
  JOIN public.order_items oi ON o.id = oi.order_id
  JOIN public.products p ON oi.product_id = p.id
  JOIN public.product_images pi ON p.id = pi.product_id
  JOIN public.users u ON o.user_id = u.id
  JOIN public.addresses a ON u.id = a.user_id
  WHERE o.id = p_order_id AND oi.id = p_item_id;
$$;


ALTER FUNCTION "public"."get_buyer_details"("p_order_id" "uuid", "p_item_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_cart_items"("p_email" "text") RETURNS TABLE("cart_id" "uuid", "product_id" "uuid", "name" "text", "quantity" integer, "price" numeric, "description" "text", "stock" integer, "slug" "text", "total_price" numeric)
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
SELECT c.id AS cart_id,
       i.product_id,
       p.name,
       i.quantity,
       p.price,
       p.description,
       p.stock,
       p.slug,
       (i.quantity * p.price) AS total_price
FROM public.carts c
JOIN public.cart_items i ON c.id = i.cart_id
JOIN public.products p ON i.product_id = p.id
WHERE c.user_id = (SELECT id FROM public.users WHERE email = p_email)
ORDER BY i.added_at DESC;
$$;


ALTER FUNCTION "public"."get_cart_items"("p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_filtered_products"("p_search_term" "text") RETURNS TABLE("id" "uuid", "product_name" "text", "product_slug" "text", "product_desc" "text", "category_slug" "text", "price" numeric, "stock" integer, "category_name" "text", "category_desc" "text", "image_url" "text", "alt_text" "text", "rank" double precision)
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$

SELECT * FROM (
  SELECT DISTINCT ON (p.id)
    p.id AS id,
    p.name AS product_name,
    p.slug AS product_slug,
    p.description AS product_desc,
    c.slug AS category_slug,
    p.price,
    p.stock,
    c.name AS category_name,
    c.description AS category_desc,
    i.image_url,
    i.alt_text,
    ts_rank(p.search_vector || c.search_vector, to_tsquery('english', p_search_term)) AS rank
  FROM public.products p
  JOIN public.categories c ON p.category_id = c.id
  JOIN public.product_images i ON p.id = i.product_id
  WHERE (p.search_vector || c.search_vector) @@ to_tsquery('english', p_search_term)
  ORDER BY p.id, rank DESC
) AS ranked_products
ORDER BY rank DESC;
$$;


ALTER FUNCTION "public"."get_filtered_products"("p_search_term" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "description" "text",
    "category_id" "uuid",
    "stock" integer DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "slug" character varying(255) NOT NULL,
    "search_vector" "tsvector",
    "seller_id" "uuid"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") RETURNS SETOF "public"."products"
    LANGUAGE "sql" STABLE
    AS $$
  WITH unique_sellers AS (
    SELECT DISTINCT ON (seller_id)
      *
    FROM products
    WHERE category_id = category
    ORDER BY seller_id, created_at DESC
  )
  SELECT * FROM unique_sellers
  ORDER BY created_at DESC;
$$;


ALTER FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) RETURNS TABLE("id" "uuid", "name" "text", "price" numeric, "description" "text", "category_id" "uuid", "created_at" timestamp with time zone, "slug" "text", "seller_id" "uuid", "category_name" "text", "category_slug" "text", "product_image_id" "uuid", "image_url" "text")
    LANGUAGE "sql" STABLE
    AS $$
  with unique_sellers as (
    select distinct on (p.seller_id)
      p.id,
      p.name,
      p.price,
      p.description,
      p.category_id,
      p.created_at,
      p.slug,
      p.seller_id,
      c.name as category_name,
      c.slug as category_slug,
      pi.id as product_image_id,
      pi.image_url
    from products p
    join categories c on p.category_id = c.id
    join product_images pi on pi.product_id = p.id
    where p.category_id = p_category
    order by p.seller_id, p.created_at desc
  )
  select *
  from unique_sellers
  order by created_at desc
  limit p_limit;
$$;


ALTER FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_orders"("p_user_email" "text") RETURNS TABLE("order_item_id" "uuid", "quantity" integer, "price" numeric, "order_placed_at" timestamp with time zone, "product_id" "uuid", "product_name" "text", "product_slug" "text", "files" "text"[], "category_name" "text", "category_slug" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT 
    i.id AS order_item_id,
    i.quantity,
    i.price,
    i.created_at AS order_placed_at,
    p.id AS product_id,
    p.name AS product_name,
    p.slug AS product_slug,
    ARRAY_AGG(DISTINCT pf.file_url) AS files,
    c.name AS category_name,
    c.slug AS category_slug
  FROM public.orders o
  JOIN public.order_items i ON o.id = i.order_id
  JOIN public.users u ON o.user_id = u.id
  JOIN public.products p ON p.id = i.product_id
  JOIN public.product_files pf ON p.id = pf.product_id
  JOIN public.categories c ON p.category_id = c.id
  WHERE u.email = p_user_email
  GROUP BY i.id, p.id, p.slug, c.name, c.slug
  ORDER BY i.created_at DESC;
$$;


ALTER FUNCTION "public"."get_orders"("p_user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_product"("p_slug" "text") RETURNS TABLE("product_id" "uuid", "product_name" "text", "product_slug" "text", "product_desc" "text", "category_slug" "text", "price" numeric, "stock" integer, "category_name" "text", "category_desc" "text", "seller_id" "uuid", "shop_name" "text", "shop_slug" "text", "shop_logo" "text", "shop_rating" numeric, "files" "text"[], "images" "text"[], "alt_texts" "text"[])
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$
    SELECT 
      p.id AS product_id,
      p.name AS product_name,
      p.slug AS product_slug,
      p.description AS product_desc,
      c.slug AS category_slug,
      p.price,
      p.stock,
      c.name AS category_name,
      c.description AS category_desc,
      s.id AS seller_id,
      s.shop_name,
      s.shop_slug,
      s.shop_logo,
      s.rating AS shop_rating,
      ARRAY_AGG(DISTINCT f.file_url) AS files,
      ARRAY_AGG(DISTINCT i.image_url) AS images,
      ARRAY_AGG(DISTINCT i.alt_text) AS alt_texts
    FROM public.products p
    JOIN public.categories c ON p.category_id = c.id
    JOIN public.product_images i ON p.id = i.product_id
    LEFT JOIN public.product_files f ON p.id = f.product_id
    JOIN public.sellers s ON p.seller_id = s.id
    WHERE p.slug = p_slug
    GROUP BY p.id, c.slug, c.name, c.description, s.id;
$$;


ALTER FUNCTION "public"."get_product"("p_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_products"() RETURNS TABLE("id" "uuid", "product_name" "text", "product_slug" "text", "product_desc" "text", "category_slug" "text", "price" numeric, "stock" integer, "updated_at" timestamp with time zone, "seller_id" "uuid", "category_name" "text", "category_desc" "text", "image_url" "text", "alt_text" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT DISTINCT ON (p.id)
    p.id,
    p.name,
    p.slug,
    p.description,
    c.slug,
    p.price,
    p.stock,
    p.updated_at,
    p.seller_id,
    c.name,
    c.description,
    i.image_url,
    i.alt_text
  FROM public.products p
  JOIN public.categories c ON p.category_id = c.id
  JOIN public.product_images i ON p.id = i.product_id;
$$;


ALTER FUNCTION "public"."get_products"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_products_by_category"("p_category_slug" "text") RETURNS TABLE("id" "uuid", "product_name" "text", "slug" "text", "product_desc" "text", "price" numeric, "stock" integer, "category_name" "text", "category_desc" "text", "images" "text"[], "alt_texts" "text"[])
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$
    SELECT 
      p.id as id, 
      p.name as product_name, 
      p.slug, 
      p.description as product_desc, 
      p.price, 
      p.stock, 
      c.name as category_name, 
      c.description as category_desc, 
      ARRAY_AGG(i.image_url) AS images,
      ARRAY_AGG(i.alt_text) AS alt_texts
    FROM public.products p
    INNER JOIN public.categories c ON p.category_id = c.id
    LEFT JOIN public.product_images i ON p.id = i.product_id
    WHERE c.slug = p_category_slug
    GROUP BY p.id, c.name, c.description;
$$;


ALTER FUNCTION "public"."get_products_by_category"("p_category_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_search_suggestions"("p_search_term" "text") RETURNS TABLE("id" "uuid", "product_name" "text", "product_slug" "text", "category_name" "text", "category_slug" "text")
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$

SELECT
  p.id,
  p.name AS product_name,
  p.slug AS product_slug,
  c.name AS category_name,
  c.slug AS category_slug
FROM public.products p
JOIN public.categories c ON p.category_id = c.id
WHERE
  p.search_vector @@ plainto_tsquery('english', p_search_term)
  OR c.search_vector @@ plainto_tsquery('english', p_search_term)
LIMIT 5;
$$;


ALTER FUNCTION "public"."get_search_suggestions"("p_search_term" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seller_bank_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seller_id" "uuid",
    "account_holder_name" character varying(255) NOT NULL,
    "account_number" character varying(20) NOT NULL,
    "ifsc_code" character varying(11) NOT NULL,
    "phone" character varying(255),
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "verification_status" character varying(10),
    CONSTRAINT "seller_bank_details_verification_status_check" CHECK ((("verification_status")::"text" = ANY (ARRAY[('SUCCESS'::character varying)::"text", ('PENDING'::character varying)::"text", ('REJECTED'::character varying)::"text"])))
);


ALTER TABLE "public"."seller_bank_details" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_bank_details"("p_email" "text") RETURNS SETOF "public"."seller_bank_details"
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT sbd.*
  FROM public.seller_bank_details sbd
  JOIN public.sellers s ON sbd.seller_id = s.id
  JOIN public.users u ON s.user_id = u.id
  WHERE u.email = p_email;
$$;


ALTER FUNCTION "public"."get_seller_bank_details"("p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_details"("p_order_item_id" "uuid") RETURNS TABLE("product_id" "uuid", "product_name" "text", "first_name" "text", "email" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT 
    p.id AS product_id,
    p.name AS product_name,
    u.first_name,
    u.email
  FROM public.order_items oi 
  JOIN public.orders o ON oi.order_id = o.id
  JOIN public.products p ON p.id = oi.product_id
  JOIN public.sellers s ON p.seller_id = s.id
  JOIN public.users u ON s.user_id = u.id
  WHERE oi.id = p_order_item_id;
$$;


ALTER FUNCTION "public"."get_seller_details"("p_order_item_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_seller_orders"("p_user_email" "text") RETURNS TABLE("order_id" "uuid", "total_amount" numeric, "order_date" timestamp with time zone, "product_name" "text", "product_image" "text", "item_id" "uuid", "quantity" integer, "price" numeric)
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT DISTINCT ON (oi.id)
    o.id AS order_id,
    o.total_amount,
    o.created_at AS order_date,
    p.name AS product_name,
    pi.image_url AS product_image,
    oi.id AS item_id,
    oi.quantity,
    oi.price
  FROM
    public.seller_orders so
  JOIN
    public.orders o ON so.order_id = o.id
  JOIN
    public.order_items oi ON oi.order_id = o.id
  JOIN
    public.products p ON oi.product_id = p.id
  JOIN
    public.product_images pi ON p.id = pi.product_id
  JOIN
    public.sellers s ON s.id = so.seller_id
  JOIN
    public.users u ON s.user_id = u.id
  WHERE
    u.email = p_user_email
  ORDER BY
    oi.id, o.created_at DESC;
$$;


ALTER FUNCTION "public"."get_seller_orders"("p_user_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_shop_details"("p_email" "text") RETURNS TABLE("id" "uuid", "shop_name" "text", "shop_description" "text", "shop_slug" "text", "rating" double precision, "shop_logo" "text", "shop_banner" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$

SELECT
  s.id,
  s.shop_name,
  s.shop_description,
  s.shop_slug,
  s.rating,
  s.shop_logo,
  s.shop_banner
FROM public.sellers s
JOIN public.users u ON s.user_id = u.id
WHERE u.email = p_email;
$$;


ALTER FUNCTION "public"."get_shop_details"("p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_shop_products"("p_seller_id" "uuid") RETURNS TABLE("product_id" "uuid", "product_name" "text", "product_description" "text", "product_slug" "text", "stock" integer, "price" numeric, "updated_at" timestamp with time zone, "category_name" "text", "files" "text"[], "images" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_description,
    p.slug AS product_slug,
    p.stock,
    p.price,
    p.updated_at,
    c.name AS category_name,
    ARRAY_AGG(DISTINCT f.file_url) AS files,
    ARRAY_AGG(i.image_url) AS images
  FROM public.products p
  JOIN public.product_images i ON p.id = i.product_id
  LEFT JOIN public.product_files f ON p.id = f.product_id
  JOIN public.categories c ON p.category_id = c.id
  WHERE p.seller_id = p_seller_id
  GROUP BY p.id, c.name;
$$;


ALTER FUNCTION "public"."get_shop_products"("p_seller_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_shop_products_by_slug"("p_shop_slug" "text") RETURNS TABLE("product_id" "uuid", "product_name" "text", "product_description" "text", "price" numeric, "stock" integer, "product_slug" "text", "category_name" "text", "images" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_description,
    p.price,
    p.stock,
    p.slug AS product_slug,
    c.name AS category_name,
    ARRAY_AGG(i.image_url) AS images
  FROM public.sellers s
  JOIN public.products p ON s.id = p.seller_id
  JOIN public.product_images i ON p.id = i.product_id
  JOIN public.categories c ON p.category_id = c.id
  WHERE s.shop_slug = p_shop_slug
  GROUP BY p.id, p.name, p.description, p.price, p.stock, p.slug, c.name;
$$;


ALTER FUNCTION "public"."get_shop_products_by_slug"("p_shop_slug" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_details_by_email"("p_email" "text") RETURNS TABLE("id" "uuid", "username" "text", "email" "text", "first_name" "text", "last_name" "text", "image_url" "text", "address_line1" "text", "address_line2" "text", "city" "text", "state" "text", "zip_code" "text", "country" "text", "phone" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  SELECT 
    u.id, 
    u.username, 
    u.email, 
    u.first_name, 
    u.last_name, 
    u.image_url, 
    a.address_line1, 
    a.address_line2, 
    a.city, 
    a.state, 
    a.zip_code, 
    a.country, 
    a.phone
  FROM public.users u 
  LEFT JOIN public.addresses a ON u.id = a.user_id 
  WHERE u.email = p_email;
$$;


ALTER FUNCTION "public"."get_user_details_by_email"("p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.users (id, email, username, image_url)
  VALUES (
    NEW.id,
    NEW.email,
    -- Use the first available name field from the OAuth metadata
    COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1) -- Fallback to the email part
    ),
    -- Use the first available image field
    COALESCE(
      NEW.raw_user_meta_data ->> 'image',
      NEW.raw_user_meta_data ->> 'avatar_url'
    )
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE TRIGGER "on_auth_user_created"
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


CREATE OR REPLACE FUNCTION "public"."update_category_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_category_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_product_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_stock"("p_product_id" "uuid", "p_quantity" integer) RETURNS "void"
    LANGUAGE "sql"
    SET "search_path" TO ''
    AS $$
  UPDATE public.products
  SET stock = stock - p_quantity
  WHERE id = p_product_id;
$$;


ALTER FUNCTION "public"."update_product_stock"("p_product_id" "uuid", "p_quantity" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "neon_auth"."users_sync" (
    "raw_json" "jsonb" NOT NULL,
    "id" "text" GENERATED ALWAYS AS (("raw_json" ->> 'id'::"text")) STORED NOT NULL,
    "name" "text" GENERATED ALWAYS AS (("raw_json" ->> 'display_name'::"text")) STORED,
    "email" "text" GENERATED ALWAYS AS (("raw_json" ->> 'primary_email'::"text")) STORED,
    "created_at" timestamp with time zone GENERATED ALWAYS AS ("to_timestamp"(("trunc"(((("raw_json" ->> 'signed_up_at_millis'::"text"))::bigint)::double precision) / (1000)::double precision))) STORED,
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "neon_auth"."users_sync" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "address_line1" character varying(255) NOT NULL,
    "address_line2" character varying(255),
    "city" character varying(100) NOT NULL,
    "state" character varying(100) NOT NULL,
    "zip_code" character varying(20) NOT NULL,
    "country" character varying(100) NOT NULL,
    "is_default" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "phone" character varying(255)
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blogposts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "cover_image" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "category" character varying(255) NOT NULL,
    "published_status" boolean DEFAULT false,
    "description" "text"
);


ALTER TABLE "public"."blogposts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "cart_id" "uuid",
    "product_id" "uuid",
    "quantity" integer DEFAULT 1 NOT NULL,
    "added_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "user_id" "uuid"
);


ALTER TABLE "public"."carts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "slug" character varying(255) NOT NULL,
    "search_vector" "tsvector",
    "image_url" "text"
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "product_id" "uuid",
    "quantity" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "total_amount" numeric(10,2) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "user_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "payment_method" character varying(50) NOT NULL,
    "status" character varying(50) DEFAULT 'Pending'::character varying,
    "transaction_id" character varying(255),
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payouts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seller_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."payouts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_files" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "file_url" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."product_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "image_url" "text" NOT NULL,
    "alt_text" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "comment" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "seller_id" "uuid",
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seller_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seller_id" "uuid",
    "order_id" "uuid",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."seller_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sellers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "shop_name" character varying(255),
    "shop_description" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "shop_logo" "text",
    "shop_slug" character varying(255),
    "rating" integer,
    "shop_banner" "text",
    "store_theme" "jsonb" DEFAULT '{"layout": "modern", "primaryColor": "#0f172a"}'::"jsonb",
    CONSTRAINT "sellers_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."sellers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "is_seller" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "image_url" "text",
    "password" "text",
    "reset_password_token" "text",
    "reset_password_token_expiry" "text",
    "role" character varying(50),
    "source" character varying(255)
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "neon_auth"."users_sync"
    ADD CONSTRAINT "users_sync_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blogposts"
    ADD CONSTRAINT "blogposts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blogposts"
    ADD CONSTRAINT "blogposts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."blogposts"
    ADD CONSTRAINT "blogposts_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cartid_productid_unique" UNIQUE ("cart_id", "product_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_files"
    ADD CONSTRAINT "product_files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seller_bank_details"
    ADD CONSTRAINT "seller_bank_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seller_orders"
    ADD CONSTRAINT "seller_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_shop_logo_key" UNIQUE ("shop_logo");



ALTER TABLE ONLY "public"."seller_bank_details"
    ADD CONSTRAINT "unique_seller_id" UNIQUE ("seller_id");



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "unique_user_id" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_reset_password_token_key" UNIQUE ("reset_password_token");



CREATE INDEX "users_sync_deleted_at_idx" ON "neon_auth"."users_sync" USING "btree" ("deleted_at");



CREATE INDEX "categories_search_vector_idx" ON "public"."categories" USING "gin" ("search_vector");



CREATE INDEX "products_search_vector_idx" ON "public"."products" USING "gin" ("search_vector");



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."addresses" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."carts" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."seller_bank_details" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



CREATE OR REPLACE TRIGGER "trigger_update_category_search_vector" BEFORE INSERT OR UPDATE ON "public"."categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_category_search_vector"();



CREATE OR REPLACE TRIGGER "trigger_update_product_search_vector" BEFORE INSERT OR UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_product_search_vector"();



ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."carts"
    ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_files"
    ADD CONSTRAINT "product_files_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seller_bank_details"
    ADD CONSTRAINT "seller_bank_details_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seller_orders"
    ADD CONSTRAINT "seller_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seller_orders"
    ADD CONSTRAINT "seller_orders_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sellers"
    ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow anyone to read profiles" ON "public"."users" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow anyone to view reviews" ON "public"."reviews" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow authenticated users to create payouts" ON "public"."payouts" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow buyers to create orders" ON "public"."seller_orders" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "orders"."user_id"
   FROM "public"."orders"
  WHERE ("orders"."id" = "seller_orders"."order_id"))));



CREATE POLICY "Allow buyers to create payment" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow delete for product owners" ON "public"."product_files" FOR DELETE TO "authenticated" USING ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_files"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow delete for product owners" ON "public"."product_images" FOR DELETE TO "authenticated" USING ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_images"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow full access for cart owners" ON "public"."cart_items" TO "authenticated" USING ((( SELECT "carts"."user_id"
   FROM "public"."carts"
  WHERE ("carts"."id" = "cart_items"."cart_id")) = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ((( SELECT "carts"."user_id"
   FROM "public"."carts"
  WHERE ("carts"."id" = "cart_items"."cart_id")) = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Allow full control for owner" ON "public"."addresses" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow full control for owner only" ON "public"."seller_bank_details" TO "authenticated" USING (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow individual insert access" ON "public"."order_items" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "orders"."user_id"
   FROM "public"."orders"
  WHERE ("orders"."id" = "order_items"."order_id")) = "auth"."uid"()));



CREATE POLICY "Allow individual insert access" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow individual read access" ON "public"."order_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow individual read access" ON "public"."orders" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow individual update access" ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Allow insert for product owners" ON "public"."product_files" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_files"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow insert for product owners" ON "public"."product_images" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_images"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow public read access" ON "public"."blogposts" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access" ON "public"."categories" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access" ON "public"."product_files" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access" ON "public"."product_images" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access" ON "public"."products" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow public read access" ON "public"."sellers" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow sellers to delete their own products" ON "public"."products" FOR DELETE TO "authenticated" USING (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow sellers to insert their own products" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow sellers to read their own orders" ON "public"."seller_orders" FOR SELECT TO "authenticated" USING (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow sellers to read their payouts" ON "public"."payouts" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = ( SELECT "sellers"."user_id"
   FROM "public"."sellers"
  WHERE ("sellers"."id" = "payouts"."seller_id"))));



CREATE POLICY "Allow sellers to update their own products" ON "public"."products" FOR UPDATE TO "authenticated" USING (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("seller_id" = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow update for product owners" ON "public"."product_files" FOR UPDATE TO "authenticated" USING ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_files"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_files"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow update for product owners" ON "public"."product_images" FOR UPDATE TO "authenticated" USING ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_images"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK ((( SELECT "products"."seller_id"
   FROM "public"."products"
  WHERE ("products"."id" = "product_images"."product_id")) = ( SELECT "sellers"."id"
   FROM "public"."sellers"
  WHERE ("sellers"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "Allow users to create their cart" ON "public"."carts" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow users to insert their own seller profile" ON "public"."sellers" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow users to read their own cart" ON "public"."carts" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow users to update their cart only" ON "public"."carts" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow users to update their own seller profile" ON "public"."sellers" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Deny all access" ON "public"."leads" USING (false) WITH CHECK (false);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK (true);



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blogposts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."carts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payouts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seller_bank_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seller_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sellers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."create_cart_user_by_email"("user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_cart_user_by_email"("user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_cart_user_by_email"("user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_avg_product_rating"("p_product_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_avg_product_rating"("p_product_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_avg_product_rating"("p_product_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_avg_shop_rating"("p_shop_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_avg_shop_rating"("p_shop_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_avg_shop_rating"("p_shop_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_buyer_details"("p_order_id" "uuid", "p_item_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_buyer_details"("p_order_id" "uuid", "p_item_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_buyer_details"("p_order_id" "uuid", "p_item_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_cart_items"("p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_cart_items"("p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_cart_items"("p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_filtered_products"("p_search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_filtered_products"("p_search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_filtered_products"("p_search_term" "text") TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."products" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."products" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."products" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") TO "postgres";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("category" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_latest_products_per_seller"("p_category" "uuid", "p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_orders"("p_user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_orders"("p_user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_orders"("p_user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_product"("p_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_product"("p_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_product"("p_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_products"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_products"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_products"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_products_by_category"("p_category_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_products_by_category"("p_category_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_products_by_category"("p_category_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_search_suggestions"("p_search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_search_suggestions"("p_search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_search_suggestions"("p_search_term" "text") TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_bank_details" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_bank_details" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_bank_details" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_bank_details"("p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_bank_details"("p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_bank_details"("p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_details"("p_order_item_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_details"("p_order_item_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_details"("p_order_item_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_seller_orders"("p_user_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_seller_orders"("p_user_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_seller_orders"("p_user_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_shop_details"("p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_shop_details"("p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_shop_details"("p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_shop_products"("p_seller_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_shop_products"("p_seller_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_shop_products"("p_seller_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_shop_products_by_slug"("p_shop_slug" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_shop_products_by_slug"("p_shop_slug" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_shop_products_by_slug"("p_shop_slug" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_details_by_email"("p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_details_by_email"("p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_details_by_email"("p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_category_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_category_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_category_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_stock"("p_product_id" "uuid", "p_quantity" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_stock"("p_product_id" "uuid", "p_quantity" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_stock"("p_product_id" "uuid", "p_quantity" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";


















GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."addresses" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."addresses" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."addresses" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."blogposts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."blogposts" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."blogposts" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."cart_items" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."cart_items" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."cart_items" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."carts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."carts" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."carts" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."categories" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."categories" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."categories" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."leads" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."leads" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."leads" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."order_items" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."order_items" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."order_items" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."orders" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."orders" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."orders" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payments" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payments" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payments" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payouts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payouts" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."payouts" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_files" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_files" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_files" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_images" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_images" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."product_images" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."reviews" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."reviews" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."reviews" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_orders" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_orders" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."seller_orders" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."sellers" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."sellers" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."sellers" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";































