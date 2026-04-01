import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const safeLimit = Math.min(limit, 50);

  const { data, error } = await supabase
    .from("uploads")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + safeLimit - 1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data, count: data?.length ?? 0 });
}
