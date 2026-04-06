"use client";

import { useCallback, useEffect, useState } from "react";

export function useUserMaster() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [accountInactive, setAccountInactive] = useState(false);
  const [statusRestricted, setStatusRestricted] = useState(false);
  const [limitedAccess, setLimitedAccess] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user-master/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setSession(null);
        setUser(null);
        setAccess(null);
        setAccountInactive(false);
        setStatusRestricted(false);
        setLimitedAccess(false);
        return;
      }

      const payload = await response.json();
      setSession(payload?.session || null);
      setUser(payload?.user || null);
      setAccess(payload?.access || null);
      setAccountInactive(Boolean(payload?.accountInactive));
      setStatusRestricted(Boolean(payload?.statusRestricted));
      setLimitedAccess(Boolean(payload?.limitedAccess));
    } catch {
      setSession(null);
      setUser(null);
      setAccess(null);
      setAccountInactive(false);
      setStatusRestricted(false);
      setLimitedAccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    loading,
    session,
    user,
    access,
    accountInactive,
    statusRestricted,
    limitedAccess,
    refresh,
    isAuthenticated: Boolean(session?.userId),
  };
}
