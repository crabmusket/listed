import PropTypes from "prop-types";
import React from "react";
import "./Footer.scss";

const Footer = ({ blogPage, author }) => (
    <div id="footer" className={blogPage ? "footer--blog-page" : ""}>
        <div className="footer__container">
            <p className="p3">Listed Blogging Platform</p>
            {author && (
                <p className="p3">
                    Copyright ©
                    {" "}
                    {(new Date()).getFullYear()}
                    {" "}
                    {author.display_name}
                </p>
            )}
            <p className="p3">
                By
                {" "}
                <a href="https://standardnotes.org" target="_blank" rel="noopener noreferrer">
                    Standard Notes
                </a>
            </p>
        </div>
    </div>
);

Footer.propTypes = {
    author: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
    }),
    blogPage: PropTypes.bool,
};

Footer.defaultProps = {
    author: null,
    blogPage: false,
};

export default (props) => <Footer {...props} />;
