"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import Link from "next/link";
import "./messages.css";

const Messages = () => {
  const user = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <section className="messages-page">
      <div className="container">
        <h2>Messages</h2>

        {user ? (
          <div className="messages">
            Messages from the Kampabode will appear here.
          </div>
        ) : (
          <>
            <p>you have to login to view messages.</p>
            <Link href={"/auth/login"} className="btn">
              Log in
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default Messages;
