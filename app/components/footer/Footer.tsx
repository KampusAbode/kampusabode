"use client";
import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { usePathname } from "next/navigation";
import data from "../../fetch/contents";
import "./footer.css";

export default function Footer() {
  const pathname = usePathname();

  const { homeSection } = data;
  const { footer } = homeSection;

  // Render the footer only if the pathname contains any of the excluded paths
  const excludedPaths = [
    "login",
    "signup",
    "properties",
    "dashboard",
    "chat",
    "adminchatroom",
  ];
  if (excludedPaths.some((path) => pathname.includes(`/${path}`))) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-sections">
          {/* Company Info */}
          <div className="footer-column">
            <h6>Company</h6>
            <ul>
              {footer.company.map((link) => (
                <li key={link.name}>
                  <Link prefetch href={link.to}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="footer-column">
            <h6>Support</h6>
            <ul>
              {footer.support.map((link) => (
                <li key={link.name}>
                  <Link prefetch href={link.to}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-column">
            <h6>Follow Us</h6>
            <div className="social-links">
              {footer.socials.map((link) => (
                <Link
                  key={link.name}
                  href={link.to}
                  aria-label={link.name}
                  title={link.name}>
                  <link.icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2025 created by{" "}
            <Link
              href="https://ajalatolulope.vercel.app"
              aria-label="Portfolio"
              title="Portfolio">
              <span>thewebedits</span>
            </Link>
            , designed by aj.tolulope
          </p>
        </div>
      </div>
    </footer>
  );
}
