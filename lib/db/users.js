import { sql } from "@vercel/postgres";

export async function getUserByEmail(email) {
  let query = `
    SELECT * FROM users WHERE email = $1
  `;

  const { rows } = await sql.query(query, [email]);
  return rows;
}

export async function createUserDetails(userDetails) {
  // Insert into users table
  let user_query = `
    INSERT INTO users (username, email, first_name, last_name, image_url) VALUES
    ($1, $2, $3, $4, $5)
  `;

  await sql.query(user_query, [
    userDetails.username,
    userDetails.email,
    userDetails.firstName,
    userDetails.lastName,
    userDetails.imageUrl,
  ]);

  const user = await getUserByEmail(userDetails.email);
  const { id: userId } = user[0];

  // Insert into addresses table
  let address_query = `
    INSERT INTO addresses (user_id, address_line1, address_line2, city, state, zip_code, country, phone) VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  await sql.query(address_query, [
    userId,
    userDetails.addressLine1,
    userDetails.addressLine2,
    userDetails.city,
    userDetails.state,
    userDetails.zipCode,
    userDetails.country,
    userDetails.phone,
  ]);
}

export async function getUserDetailsByEmail(email) {
  const query = `
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
    FROM users u JOIN addresses a
    ON u.id = a.user_id
    WHERE email = $1
  `;

  const { rows } = await sql.query(query, [email]);
  return rows;
}

export async function createSeller(email) {
  try {
    const { rows } = sql`
    UPDATE users
    SET is_seller = true
    WHERE email = ${email}
    RETURNING id;
    `;

    return rows;
  } catch (error) {
    console.error("Error creating Seller");
    throw new Error("Something went wrong. Try again!");
  }
}
