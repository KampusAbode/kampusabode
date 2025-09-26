"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin } from "../../utils";
import Loader from "../../components/loader/Loader";
import ReferralManagement from "../../components/admin/ReferralManagement";

const ReferralsPage = () => {
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function validateUser(userId: string) {
      try {
        const admin = await checkIsAdmin(userId);
        if (!admin) {
          router.push("/apartment");
          return;
        }
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    }

    validateUser(user?.id);
    setLoading(false);
  }, [user, router]);

  if (loading) return <Loader />;
  if (!isAdmin) return null;

  return <ReferralManagement />;
};

export default ReferralsPage;
