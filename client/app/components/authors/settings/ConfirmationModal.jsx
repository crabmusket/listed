import PropTypes from "prop-types";
import React, { useState } from "react";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({ text, primaryOption, secondaryOption }) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const onClickSecondary = async () => {
        setIsSubmitDisabled(true);

        try {
            await secondaryOption.onClick();
        } catch (err) {
            setIsSubmitDisabled(false);
        }
    };

    return (
        <div className="confirmation-modal__overlay">
            <div className="confirmation-modal__modal card">
                <p className="p2">
                    {text}
                </p>
                <div className="confirmation-modal__buttons">
                    <button
                        className={`button ${isSubmitDisabled ? "button--secondary-disabled" : "button--no-fill"}`}
                        onClick={onClickSecondary}
                        disabled={isSubmitDisabled}
                        type="button"
                    >
                        {secondaryOption.text}
                    </button>
                    <button
                        className="button button--primary"
                        onClick={primaryOption.onClick}
                        type="button"
                    >
                        {primaryOption.text}
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmationModal.propTypes = {
    primaryOption: PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    secondaryOption: PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    text: PropTypes.string.isRequired,
};

export default ConfirmationModal;
