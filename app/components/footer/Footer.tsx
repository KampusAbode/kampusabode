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
  const excludedPaths = ["login", "signup", "dashboard", "chat"];
  if (excludedPaths.some((path) => pathname.includes(`/${path}`))) {
    return null;
  }


  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-sections">
          {/* Company Info */}
          <div className="footer-column">
            <h5>Company</h5>
            <ul>
              {footer.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.to}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="footer-column">
            <h5>Support</h5>
            <ul>
              {footer.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.to}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-column">
            <h5>Follow Us</h5>
            <div className="social-links">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                title="Facebook">
                <FaFacebook />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                title="Instagram">
                <FaInstagram />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                title="Twitter">
                <FaTwitter />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="Linkedin"
                title="Linkedin">
                <FaLinkedin />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <address>
            &copy; 2024 created by{" "}
            <Link
              href="https://aj-tolulope.github.io/portfolio"
              aria-label="Portfolio"
              title="Portfolio">
              <span>thewebedits</span>
            </Link>
            , designed by aj.tolulope
          </address>
        </div>
      </div>
    </footer>
  );
}
