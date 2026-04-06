"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Container, Spinner } from "react-bootstrap";
import Header from "@/shared/components/layout/Header";
import { useUserMaster } from "@/modules/user-master/hooks/useUserMaster";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutBusy, setLogoutBusy] = useState(false);
  const { loading, user, access, isAuthenticated } = useUserMaster();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  async function handleLogout() {
    setLogoutBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setLogoutBusy(false);
      router.replace("/login");
    }
  }

  if (loading) {
    return (
      <main className="auth-loading">
        <Spinner animation="border" role="status" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const roleKeys = Array.isArray(access?.roleKeys)
    ? access.roleKeys.map((value) => String(value || "").toLowerCase())
    : [];
  const normalizedUserRole = String(user?.role || user?.role_name || "").toLowerCase();
  const showConfiguration =
    Boolean(access?.isDevMain) ||
    roleKeys.includes("devmain") ||
    roleKeys.includes("admin") ||
    normalizedUserRole === "devmain" ||
    normalizedUserRole === "admin";

  return (
    <div className="app-shell">
      <Header
        pathname={pathname}
        user={user}
        onLogout={handleLogout}
        logoutBusy={logoutBusy}
        showConfiguration={showConfiguration}
      />
      <Container fluid className="app-shell-body">
        <section className="app-content">{children}</section>
      </Container>
    </div>
  );
}
