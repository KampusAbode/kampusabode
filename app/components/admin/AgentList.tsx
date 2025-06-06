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
// import "./admin.css"; // assuming you want the same admin CSS

const AgentList = () => {
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const [agents, setAgents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Redirect to login if no user
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // 2. Redirect away if not admin
    if (!checkIsAdmin(user.id)) {
      router.push("/apartment");
      return;
    }

    // 3. Fetch all agents from Firestore
    const fetchAgents = async () => {
      try {
        const usersRef = collection(db, "users");
        const agentsQuery = query(usersRef, where("userType", "==", "agent"));
        const snapshot = await getDocs(agentsQuery);

        const agentList: UserType[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            name: (data.name as string) || "",
            email: (data.email as string) || "",
            bio: (data.bio as string) || "",
            avatar: (data.avatar as string) || "",
            phoneNumber: (data.phoneNumber as string) || "",
            university: (data.university as string) || "",
            userType: data.userType as "agent",
            userInfo: data.userInfo as any, // should match AgentUserInfo
          };
        });

        setAgents(agentList);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [router, user]);

  if (loading) return <Loader />;

  return (
    <div className="adminList">
      <div className="">
        <h3>Upload for Agents</h3>
        {agents.length === 0 ? (
          <p>No agents found.</p>
        ) : (
          <ul className="agent-list">
            {agents.map((agent) => (
              <li key={agent.id} className="agent-item">
                <div className="agent-info">
                 
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-email">{agent.email}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    router.push(`/uploadforagent?agentId=${agent.id}`)
                  }
                >
                  Upload for this agent
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AgentList;
