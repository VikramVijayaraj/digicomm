import { sql } from "@vercel/postgres";

export async function getUser(email) {
  let query = `
    SELECT * FROM users WHERE email = $1
  `;

  const { rows } = await sql.query(query, [email]);
  return rows;
}

export async function createUserDetails(userDetails) {
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

  const user = await getUser(userDetails.email);
  const { id: userId } = user[0];

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
