import { NextResponse } from "next/server";
import { resolveUserRoleAccess } from "@/lib/userMasterAccess";
import {
  getAuthenticatedContext,
  toErrorResponse,
} from "@/lib/userMasterRouteAuth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const appKey = searchParams.get("appKey");

    const auth = await getAuthenticatedContext();
    if (auth.error) return auth.error;

    const scopedAccess = appKey
      ? await resolveUserRoleAccess({
          userId: auth.userRecord.user_id,
          appKey,
          supabaseClient: auth.supabaseClient,
        })
      : auth.access;

    return NextResponse.json({
      session: auth.session,
      user: auth.safeUser,
      status: auth.statusRecord,
      access: scopedAccess,
    });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to load session", 500);
  }
}
