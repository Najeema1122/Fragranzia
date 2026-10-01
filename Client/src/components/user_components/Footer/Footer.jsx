import React from "react";
import './footer.css';
import { CiMail, CiPhone, CiFacebook, CiYoutube, CiLinkedin } from "react-icons/ci";
import { FaInstagram, FaXTwitter } from "react-icons/fa6"; // ← change "fa" to "fa6"
const Footer = () => {
    const pages = ["Home", "Products", "Gifting", "About", "Profile"]
    const quick_links = ["Privacy Policy", "Terms and Conditions", "FAQs", "Customer Service"]
    const footer_bottom_left = ["Web Accesibility", "Terms of Use", "Privecy Statements", "Contacts"]

    return (
        <>
            <footer>
                <div className="footer_container">
                    <div className="footer-logo">
                        Fragranzia
                    </div>
                    <div className="footer-links">
                        <p>Pages</p>
                        <ul className="Page-links">

                            {pages.map((page, index) => (
                                <li key={index}><a href="">{page}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-links">
                        <p>Quick Links</p>
                        <ul className="Qick_link">

                            {
                                quick_links.map((quick_link, index) => (
                                    <li key={index}><a href="">{quick_link}</a></li>
                                ))
                            }

                        </ul>
                    </div>
                    <div className="footer-links-right">
                        <div className="mail">
                            <CiMail />
                            <a href="">fragranzia@gmail.com</a>
                        </div>
                        <div className="phone">
                            <CiPhone />
                            <a href="">+91 9988776655</a>
                        </div><br />
                        <p>SOCIAL MEDIA</p>
                        <div className="social">
                            <a href=""><FaInstagram /></a>
                            <a href=""><CiFacebook /></a>
                            <a href=""><FaXTwitter /></a>
                            <a href=""><CiYoutube /></a>
                            <a href=""><CiLinkedin /></a>
                        </div>
                    </div>
                </div><hr />
                <div className="footer-bottom">
                    <div className="footer-bottom-links">
                        {footer_bottom_left.map((footer_bottom_links) => (
                            <a href="">{footer_bottom_links}</a>
                        ))
                    }
                    </div>
                    <div><span>© 2024 fragranzia Company. All rights reserved.</span></div>
                </div>

            </footer>
        </>
    )
}
export default Footer;