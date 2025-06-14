import React from 'react';
import "./Footer.css";

function Footer() {
    return (
        <div className="footerSection">
            <div className="footerGroup">
                <h3 className="footerTitle">Info</h3>
                <ul className="footerLinks">
                    <li>About</li>
                    <li>Contact</li>
                    <li>FAQ</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Use</li>
                </ul>
            </div>
            <div className="footerGroup">
                <h3 className="footerTitle">Follow us</h3>
                <ul className="footerLinks">
                    <li>Instagram</li>
                    <li>X / Twitter</li>
                    <li>Facebook</li>
                </ul>
            </div>
            <div className="footerCopyright">
                <h5>© 2025 WebFlicks. All rights reserved.</h5>
            </div>
        </div>
    );
}

export default Footer;