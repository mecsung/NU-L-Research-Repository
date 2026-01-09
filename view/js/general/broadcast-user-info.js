export async function getUserInfo() {
  try {
    // Get school_id and first_name from the cookie
    const resCookie = await fetch(
      `${baseURL}controller/authentication/get-user-cookie.php`
    );
    const cookieData = await resCookie.json();

    const { school_id, first_name } = cookieData;

    // If no cookie (guest user), just return null
    if (!school_id) {
      return null;
    }

    // Fetch the role using school_id
    const res = await fetch(
      `${baseURL}controller/authentication/get-user-role.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school_id }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      // If role fetch fails, treat as guest
      return null;
    }

    // Return all info together
    return {
      school_id,
      first_name,
      role: data.role,
    };

  } catch (err) {
    console.error("User info check failed:", err);
    // Treat errors as guest access
    return null;
  }
}
