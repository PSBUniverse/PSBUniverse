import { NextResponse } from "next/server";
import {
  removeUserAppRoleAccess,
  upsertUserAppRoleAccess,
  USER_MASTER_COLUMNS,
  USER_MASTER_TABLES,
} from "@/modules/user-master/access/user-master.access";
import {
  ADMIN_ROLE_PERMISSION_MAP,
  requireActionPermission,
  toErrorResponse,
} from "@/modules/user-master/services/user-master-route-auth.service";
import { assertMappingReferencesValid } from "@/modules/user-master/validators/user-master.validator";

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function getAdminAppKey(request) {
  const { searchParams } = new URL(request.url);
  return (
    String(searchParams.get("appKey") || "").trim() ||
    String(process.env.USER_MASTER_ADMIN_APP_KEY || "").trim() ||
    null
  );
}

export async function GET(request) {
  try {
    const gate = await requireActionPermission({
      action: "read",
      appKey: getAdminAppKey(request),
      rolePermissionMap: ADMIN_ROLE_PERMISSION_MAP,
    });

    if (gate.error) return gate.error;

    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get("user_id") || searchParams.get("userId");
    const filterAppId = searchParams.get("app_id") || searchParams.get("appId");

    let query = gate.context.supabaseClient
      .from(USER_MASTER_TABLES.userAppRoleAccess)
      .select("*")
      .order(USER_MASTER_COLUMNS.userId, { ascending: true })
      .order(USER_MASTER_COLUMNS.roleId, { ascending: true })
      .order(USER_MASTER_COLUMNS.appId, { ascending: true });

    if (hasValue(filterUserId)) {
      query = query.eq(USER_MASTER_COLUMNS.userId, filterUserId);
    }

    if (hasValue(filterAppId)) {
      query = query.eq(USER_MASTER_COLUMNS.appId, filterAppId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ mappings: data || [] });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to list access mappings", 500);
  }
}

export async function POST(request) {
  try {
    const gate = await requireActionPermission({
      action: "create",
      appKey: getAdminAppKey(request),
      rolePermissionMap: ADMIN_ROLE_PERMISSION_MAP,
    });

    if (gate.error) return gate.error;

    const body = await request.json();
    const userId = body?.user_id ?? body?.userId;
    const roleId = body?.role_id ?? body?.roleId;
    const appId = body?.app_id ?? body?.appId;

    if (!hasValue(userId) || !hasValue(roleId) || !hasValue(appId)) {
      return toErrorResponse("user_id, role_id, and app_id are required", 400);
    }

    await assertMappingReferencesValid(gate.context.supabaseClient, {
      user_id: userId,
      role_id: roleId,
      app_id: appId,
    });

    const mapping = await upsertUserAppRoleAccess({
      userId,
      roleId,
      appId,
      actorUserId: gate.context.userRecord[USER_MASTER_COLUMNS.userId],
      supabaseClient: gate.context.supabaseClient,
      additionalFields: {
        created_by: body?.created_by,
        created_at: body?.created_at,
      },
    });

    return NextResponse.json({
      message: "Access mapping upserted",
      mapping,
    });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to upsert access mapping", 500);
  }
}

export async function PATCH(request) {
  try {
    const gate = await requireActionPermission({
      action: "update",
      appKey: getAdminAppKey(request),
      rolePermissionMap: ADMIN_ROLE_PERMISSION_MAP,
    });

    if (gate.error) return gate.error;

    const body = await request.json();
    const uarId = body?.uar_id ?? body?.uarId;

    if (!hasValue(uarId)) {
      return toErrorResponse("uar_id is required", 400);
    }

    const updates = {};
    ["user_id", "role_id", "app_id", "is_active"].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body || {}, field)) {
        updates[field] = body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return toErrorResponse("No mapping update fields were provided", 400);
    }

    const { data: existing, error: existingError } = await gate.context.supabaseClient
      .from(USER_MASTER_TABLES.userAppRoleAccess)
      .select("*")
      .eq("uar_id", uarId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) {
      return toErrorResponse("Mapping not found", 404);
    }

    const nextUserId = updates.user_id ?? existing.user_id;
    const nextRoleId = updates.role_id ?? existing.role_id;
    const nextAppId = updates.app_id ?? existing.app_id;

    await assertMappingReferencesValid(gate.context.supabaseClient, {
      user_id: nextUserId,
      role_id: nextRoleId,
      app_id: nextAppId,
    });

    const { data, error } = await gate.context.supabaseClient
      .from(USER_MASTER_TABLES.userAppRoleAccess)
      .update(updates)
      .eq("uar_id", uarId)
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Access mapping updated",
      mapping: data,
    });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to update access mapping", 500);
  }
}

export async function DELETE(request) {
  try {
    const gate = await requireActionPermission({
      action: "delete",
      appKey: getAdminAppKey(request),
      rolePermissionMap: ADMIN_ROLE_PERMISSION_MAP,
    });

    if (gate.error) return gate.error;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") || searchParams.get("userId");
    const roleId = searchParams.get("role_id") || searchParams.get("roleId");
    const appId = searchParams.get("app_id") || searchParams.get("appId");

    if (!hasValue(userId) || !hasValue(roleId) || !hasValue(appId)) {
      return toErrorResponse("user_id, role_id, and app_id are required", 400);
    }

    await removeUserAppRoleAccess({
      userId,
      roleId,
      appId,
      supabaseClient: gate.context.supabaseClient,
    });

    return NextResponse.json({ message: "Access mapping deleted" });
  } catch (error) {
    return toErrorResponse(error?.message || "Unable to delete access mapping", 500);
  }
}


