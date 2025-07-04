"use client";

import { Suspense } from "react";
import AdminContent from "./AdminContent";
import Loader from "../components/loader/Loader";

export default function AdminPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminContent />
    </Suspense>
  );
}
