"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin } from "../../utils";
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function checkUserPermissions(userId: string) {
      try {
        const admin = await checkIsAdmin(userId);

        if (admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to check user permissions:", error);
      }
    }
    checkUserPermissions(user?.id);

    // Redirect away if not admin
    if (isAdmin) {
      router.push("/apartment");
      return;
    }

    // Fetch all agents from Firestore
    const fetchAgents = async () => {
      if (users) {
        const agentUsers = users.filter((user) => user.userType === "agent");
        setAgents(agentUsers);
        setLoading(false);
      }
    };

    fetchAgents();
  }, [router, user]);

  if (loading) return <Loader />;

  return (
    <div className="agent-listings">
      {agents.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "5rem" }}>
          No agents found.
        </p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id} className="agent-item">
              <div className="agent-info">
                <div className="image">
                  <Image
                    src={agent.avatar || "/assets/user_avatar.jpg"}
                    width={800}
                    height={800}
                    alt={`${agent.name}'s avatar`}
                    className="agent-avatar"
                  />
                </div>
                <span className="agent-name">
                  <strong>{agent.name}</strong>
                </span>
                <span className="agent-email">{agent.email}</span>
                <span className="agent-listings">
                  {Array.isArray((agent.userInfo as any).propertiesListed)
                    ? (agent.userInfo as any).propertiesListed.length
                    : 0} listings
                </span>
                <span className="agent-id">ID: {agent.id}</span>
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
