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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("service_plans")
      .select("*")
      .eq("status", "ACTIVE")
      .order("monthly_rate", { ascending: true });

    if (error) throw error;

    const formattedPlans = (data || []).map((plan, index) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: parseFloat(plan.monthly_rate || 0),
      data_gb: plan.data_allowance || 0,
      call_minutes: plan.voice_minutes || 0,
      sms_count: plan.sms_allowance || 0,
      features: plan.features || [],
      is_popular: index === 1,
    }));

    return new Response(
      JSON.stringify(formattedPlans),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
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