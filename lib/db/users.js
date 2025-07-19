// import { sql } from "@vercel/postgres";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getAllUsers() {
  const rows = await sql`
    SELECT * FROM users;
  `;
  return rows;
}

export async function getUserByEmail(email) {
  const rows = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;

  return rows;
}

export async function createUser(userDetails) {
  try {
    const rows = await sql`
      INSERT INTO users (username, email, password, source)
      VALUES (${userDetails.username}, ${userDetails.email}, ${userDetails.password}, ${userDetails.source})
      RETURNING id, username, email
    `;
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error creating the user. Please try again later!");
  }
}

export async function createUserDetails(userDetails) {
  try {
    // Insert into users table
    const rows = await sql`
      INSERT INTO users (username, email, first_name, last_name, image_url) VALUES
      (${userDetails.username}, ${userDetails.email}, ${userDetails.firstName}, ${userDetails.lastName}, ${userDetails.imageUrl})
      RETURNING id
  `;

    const { id: userId } = rows[0];

    // Insert into addresses table
    await sql`
      INSERT INTO addresses (user_id, address_line1, address_line2, city, state, zip_code, country, phone) VALUES
      (${userId}, ${userDetails.addressLine1}, ${userDetails.addressLine2}, ${userDetails.city}, ${userDetails.state}, ${userDetails.zipCode}, ${userDetails.country}, ${userDetails.phone})
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error submitting the data. Please try again later!");
  }
}

export async function updateUserDetails(userDetails) {
  try {
    // Update into users table
    const rows = await sql`
      UPDATE users
      SET first_name = ${userDetails.firstName}, last_name = ${userDetails.lastName}
      WHERE email = ${userDetails.email}
      RETURNING id
    `;

    const { id: userId } = rows[0];

    // Update/Insert into address table
    await sql`
      INSERT INTO addresses (user_id, address_line1, address_line2, city, state, zip_code, country, phone)
      VALUES (${userId}, ${userDetails.addressLine1}, ${userDetails.addressLine2}, ${userDetails.city}, ${userDetails.state}, ${userDetails.zipCode}, ${userDetails.country}, ${userDetails.phone})
      ON CONFLICT (user_id) DO UPDATE SET
        address_line1 = ${userDetails.addressLine1},
        address_line2 = ${userDetails.addressLine2},
        city = ${userDetails.city},
        state = ${userDetails.state},
        zip_code = ${userDetails.zipCode},
        country = ${userDetails.country},
        phone = ${userDetails.phone};
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating your data. Please try again later!");
  }
}

export async function getUserDetailsByEmail(email) {
  const rows = await sql`
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
    WHERE email = ${email}
  `;

  return rows;
}
