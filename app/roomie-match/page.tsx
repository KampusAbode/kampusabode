"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useUserStore } from "../store/userStore";
import { Button } from "../components/button/Button";
import "./roomie-match.css";

const steps = [
  {
    title: "1. Create Profile",
    description:
      "Fill out a quick form about your preferences and lifestyle.",
    Icon: ClipboardList,
  },
  {
    title: "2. Browse & Match",
    description:
      "Discover compatible roommates based on your preferences.",
    Icon: Search,
  },
  {
    title: "3. Connect",
    description: "Chat directly on WhatsApp and plan your move-in together.",
    Icon: MessageCircle,
  },
];

const benefits = [
  {
    title: "Save Money",
    description: "Split rent and utilities with a compatible roommate.",
    Icon: Wallet,
  },
  {
    title: "Perfect Match",
    description: "Filter by lifestyle, habits, and preferences.",
    Icon: Sparkles,
  },
  {
    title: "Safe & Verified",
    description: "Connect only with verified university students.",
    Icon: ShieldCheck,
  },
  {
    title: "Quick & Easy",
    description:
      "Create profile in 5 minutes, start connecting instantly.",
    Icon: Zap,
  },
];

const RoomieMatchLanding = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [activeRoommates] = useState(47);

  const handleCreateProfile = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/roomie-match/create");
  };

  const handleBrowseRoommates = () => {
    router.push("/roomie-match/browse");
  };

  return (
    <div className="roomie-landing">
      <section className="roomie-landing__hero">
        <div className="container roomie-landing__container">
          <div className="roomie-landing__hero-content">
            <div className="roomie-landing__eyebrow">
              <span className="roomie-landing__status-dot" aria-hidden="true" />
              <Users aria-hidden="true" size={16} strokeWidth={1.75} />
              <span>{activeRoommates} students actively looking</span>
            </div>

            <h1 className="roomie-landing__title">
              Find Your Perfect
              <br className="roomie-landing__desktop-break" />{" "}
              <span>Roommate</span>
            </h1>

            <p className="roomie-landing__intro">
              Connect with fellow students, share accommodation costs, and make
              university life more affordable and fun.
            </p>

            <div className="roomie-landing__actions">
              <Button
                type="button"
                onClick={handleCreateProfile}
                size="lg"
                rightIcon={<ArrowRight aria-hidden="true" />}
              >
                Create my profile
              </Button>
              <Button
                type="button"
                onClick={handleBrowseRoommates}
                variant="outline"
                size="lg"
              >
                Browse roommates
              </Button>
            </div>

            <ul className="roomie-landing__trust-list">
              <li>
                <Check aria-hidden="true" size={16} strokeWidth={2} />
                100% Free
              </li>
              <li>
                <BadgeCheck aria-hidden="true" size={16} strokeWidth={1.75} />
                Student Verified
              </li>
              <li>
                <ShieldCheck aria-hidden="true" size={16} strokeWidth={1.75} />
                Safe &amp; Secure
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="roomie-landing__section roomie-landing__steps">
        <div className="container roomie-landing__container">
          <div className="roomie-landing__section-heading">
            <h2>How RoomieMatch Works</h2>
            <p>Three simple steps to find someone who fits your campus life.</p>
          </div>

          <div className="roomie-landing__card-grid roomie-landing__step-grid">
            {steps.map(({ title, description, Icon }) => (
              <article className="roomie-landing__card" key={title}>
                <div className="roomie-landing__icon">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="roomie-landing__section roomie-landing__benefits">
        <div className="container roomie-landing__container">
          <div className="roomie-landing__section-heading">
            <h2>Why Use RoomieMatch?</h2>
          </div>

          <div className="roomie-landing__card-grid roomie-landing__benefit-grid">
            {benefits.map(({ title, description, Icon }) => (
              <article className="roomie-landing__card" key={title}>
                <div className="roomie-landing__icon">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="roomie-landing__closing">
        <div className="container roomie-landing__container roomie-landing__closing-content">
          <div>
            <h2>Ready to Find Your Roommate?</h2>
            <p>
              Join {activeRoommates}+ students already using RoomieMatch.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCreateProfile}
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight aria-hidden="true" />}
          >
            Get Started Now - It&apos;s Free!
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RoomieMatchLanding;
