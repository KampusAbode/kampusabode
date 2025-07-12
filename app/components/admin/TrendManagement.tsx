"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import { allTrends, checkIsAdmin } from "../../utils";
import { UserType } from "../../fetch/types";
import Loader from "../../components/loader/Loader";
import Image from "next/image";
import { useUsersStore } from "../../store/usersStore";
import { useTrendStore } from "../../store/trendStore";
import Link from "next/link";
import { format } from "date-fns";
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

    if (trends?.length === 0) {
      // Fetch trends using allTrends function and update local state
      const unsubscribe = allTrends((items) => {
        setTrends(items);
      });

      return () => unsubscribe();
    }
  }, [router, user]);

  return (
    <div className="trends">
      {trends?.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "5rem" }}>
          No trends found.
        </p>
      ) : (
        <ul>
          {trends?.map((trend) => (
            <li key={trend?.id} className="trend-item">
              <div className="trend-info">
                <Link href={`/trends/${trend?.slug}`}>
                <div className="image">
                  <Image
                    src={trend?.image}
                    width={1000}
                    height={1000}
                    alt={`${trend?.title}'s image`}
                    className="trend-image"
                  />
                  </div>
                </Link>
                <span className="trend-name">Title: {trend?.title}</span>
                <span className="trend-views">Views: {trend?.views}</span>
                <span className="trend-views">Likes: {trend?.likes}</span>
                <span className="trend-views">
                  Published:{" "}
                  {trend?.published_date
                    ? format(new Date(trend.published_date), "d MMM, yyyy")
                    : "Invalid date"}
                </span>
                {/* <span className="trend-email">{trend?.content}</span> */}
              </div>
              <Link
                href={`/trends/edit/${trend?.id}`}
                className="btn btn-primary">
                edit trend
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trends;
