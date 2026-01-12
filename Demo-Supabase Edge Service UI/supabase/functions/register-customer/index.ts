import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    if (!body.firstName || !body.lastName || !body.email || !body.servicePhone || !body.contactPhone || !body.planId || !body.dateOfBirth || !body.city || !body.state || !body.country) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("customers")
      .insert([
        {
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          phone_number: body.servicePhone,
          contact_number: body.contactPhone,
          date_of_birth: body.dateOfBirth,
          street_address: body.streetAddress || null,
          city: body.city,
          state: body.state,
          postal_code: body.postalCode || null,
          country: body.country,
        },
      ]);

    if (error) {
      const status = error.code === "23505" ? 409 : 400;
      let errorMessage = error.message;

      if (error.code === "23503") {
        errorMessage = "Invalid service plan selected";
      } else if (error.code === "23505") {
        if (error.message.includes("phone_number")) {
          errorMessage = "This phone number is already registered to another customer";
        } else {
          errorMessage = "This record already exists";
        }
      }

      return new Response(
        JSON.stringify({ error: errorMessage, code: error.code }),
        {
          status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    await supabase
      .from("phone_numbers")
      .update({ status: "REGISTERED" })
      .eq("number", body.servicePhone);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "An error occurred" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});