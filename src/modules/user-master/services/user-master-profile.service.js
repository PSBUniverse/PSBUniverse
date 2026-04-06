import { NextResponse } from "next/server";
import {
  USER_MASTER_TABLES,
} from "@/modules/user-master/access/user-master.access";
import {
  getAuthenticatedContext,
  sanitizeUserRecord,
  toErrorResponse,
} from "@/modules/user-master/services/user-master-route-auth.service";

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

async function loadProfileRelations(supabaseClient, userRecord) {
  const [companyRes, departmentRes, statusRes] = await Promise.all([
    hasValue(userRecord?.comp_id)
      ? supabaseClient
          .from(USER_MASTER_TABLES.companies)
          .select("*")
          .eq("comp_id", userRecord.comp_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    hasValue(userRecord?.dept_id)
      ? supabaseClient
          .from(USER_MASTER_TABLES.departments)
          .select("*")
          .eq("dept_id", userRecord.dept_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    hasValue(userRecord?.status_id)
      ? supabaseClient
          .from(USER_MASTER_TABLES.statuses)
          .select("*")
          .eq("status_id", userRecord.status_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (companyRes.error) throw companyRes.error;
  if (departmentRes.error) throw departmentRes.error;
  if (statusRes.error) throw statusRes.error;

  return {
    company: companyRes.data || null,
    department: departmentRes.data || null,
    status: statusRes.data || null,
  };
}

export async function GET() {
  try {
    const auth = await getAuthenticatedContext();
    if (auth.error) return auth.error;

    const relations = await loadProfileRelations(auth.supabaseClient, auth.userRecord);

    return NextResponse.json({
      user: sanitizeUserRecord(auth.userRecord),
      relations,
    });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to load user profile", 500);
  }
}

export async function PATCH(request) {
  try {
    const auth = await getAuthenticatedContext();
    if (auth.error) return auth.error;
    return toErrorResponse(
      "Profile and password changes are available only in Configuration & Settings. Please email your administrator.",
      403
    );
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to process profile request", 500);
  }
}


