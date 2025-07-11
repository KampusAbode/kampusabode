"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin } from "../../utils";
import { UserType } from "../../fetch/types";
import Loader from "../../components/loader/Loader";
import Image from "next/image";
import { useUsersStore } from "../../store/usersStore";
import { useTrendStore } from "../../store/trendStore";
import Link from "next/link";
// import "./admin.css"; // assuming you want the same admin CSS

const Trends = () => {
  const router = useRouter();
  const { trends, setTrends } = useTrendStore((state) => state);
  const { user } = useUserStore();

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (trends.length === 0) {
        setTrends(null);
        // console.log("Fetching trends...");
        // console.log(trends);
    }
  }, [router, user]);

  return (
    <div className="trends">
      {trends.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No trends found.
        </p>
      ) : (
        <ul>
          {trends.map((trend) => (
            <li key={trend?.id} className="trend-item">
              <div className="trend-info">
                <div className="image">
                  <Image
                    src={trend?.image}
                    width={1000}
                    height={1000}
                    alt={`${trend?.title}'s avatar`}
                    className="trend-avatar"
                  />
                </div>
                <span className="trend-name">{trend?.title}</span>
                {/* <span className="trend-email">{trend?.content}</span> */}
              </div>
              <Link
                href={`/trends/edit/${trend?.id}`}
                className="btn btn-primary">
                edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trends;
