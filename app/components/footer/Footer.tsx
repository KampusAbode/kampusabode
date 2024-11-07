"use client";
import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { usePathname } from "next/navigation";
import data from "../../fetch/contents";
import "./footer.css";

export default function Footer() {
  const pathname = usePathname().split("/").at(-1);

  const { homeSection } = data;
  const { footer } = homeSection;


  // Render the footer only if the pathname is not defined
 if (
   pathname === "login" ||
   pathname === "signup" ||
   pathname === "dashboard"
 ) {
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
              <a href="https://facebook.com">
                <FaFacebook />
              </a>
              <a href="https://instagram.com">
                <FaInstagram />
              </a>
              <a href="https://twitter.com">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2024 created by{" "}
            <Link href="https://aj-tolulope.github.io/portfolio">
              <span>thewebedits</span>
            </Link>
            , designed by aj.tolulope
          </p>
        </div>
      </div>
    </footer>
  );
}
