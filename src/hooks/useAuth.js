"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth.services";
import { api } from "@/core/axios";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const refreshRes = await authService.refresh();

      const newToken =
        refreshRes?.data?.accessToken ||
        refreshRes?.accessToken ||
        refreshRes?.data?.data?.accessToken;

      if (!newToken) {
        setUser(null);
        return;
      }

      const profileRes = await api.get("/users/me"); 
      setUser(profileRes.data?.data || profileRes.data || null);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // 🔹 Logout user
  const logout = async () => {
    try {
      await authService.logout(); 
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  return { user, setUser, loadUser, logout, loading };
}
