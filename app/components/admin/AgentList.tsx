"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin } from "../../utils/user";
import { UserType } from "../../fetch/types";
import Loader from "../../components/loader/Loader";
import Image from "next/image";
import { useUsersStore } from "../../store/usersStore";
// import "./admin.css"; // assuming you want the same admin CSS

const AgentList = () => {
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const [agents, setAgents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { users } = useUsersStore();

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Redirect away if not admin
    if (!checkIsAdmin(user.id)) {
      router.push("/apartment");
      return;
    }

    // Fetch all agents from Firestore
    const fetchAgents = async () => {
      if (users) {
        const agentUsers = users.filter((user) => user.userType === "agent");
        setAgents(agentUsers);
        setLoading(false)
      }
    };

    fetchAgents();
  }, [router, user]);

  if (loading) return <Loader />;

  return (
    <div className="agent-listings">
      <h3>Upload for Agents</h3>
      {agents.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id} className="agent-item">
              <div className="agent-info">
                <div className="image">
                  <Image
                    src={agent.avatar || "/assets/user_avatar.jpg"}
                    width={1000}
                    height={1000}
                    alt={`${agent.name}'s avatar`}
                    className="agent-avatar"
                  />
                </div>
                <span className="agent-name">{agent.name}</span>
                <span className="agent-email">{agent.email}</span>
                {/* <span>{ agent.userInfo. }</span> */}
              </div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  router.push(`/uploadforagent?agentId=${agent.id}`)
                }>
                Upload
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentList;
