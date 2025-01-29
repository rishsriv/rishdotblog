import { json } from "@remix-run/node";

// Mock storage for development
const subscribers = new Set<string>();

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return json({ success: false, message: "Email is required" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json({ success: false, message: "Invalid email format" }, { status: 400 });
  }

  try {
    // Mock database operation
    // In production, replace this with actual D1 database calls:
    // 
    // To set up D1:
    // 1. Set CLOUDFLARE_API_TOKEN environment variable
    // 2. Run: npx wrangler d1 create subscribers
    // 3. Update wrangler.toml with the database_id from the command output
    // 4. Run: npx wrangler d1 execute subscribers --local --file=./migrations/0000_create_subscribers.sql
    //
    // Then replace this code with:
    // await env.DB.prepare("INSERT INTO subscribers (email) VALUES (?)")
    //   .bind(email)
    //   .run();

    if (subscribers.has(email)) {
      return json({ success: false, message: "Email already subscribed" }, { status: 400 });
    }

    subscribers.add(email);
    console.log("Subscribed email:", email);
    return json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return json(
      { success: false, message: "Failed to subscribe" },
      { status: 500 }
    );
  }
}