import PropTypes from "prop-types";
import React from "react";
import SVG from "react-inlinesvg";
import { IcCheckboxChecked, IcCheckboxEmpty } from "../../assets/icons";
import "./Checkbox.scss";

const Checkbox = ({
    id, onClick, checked, label,
}) => (
    <div className={`form-section checkbox__container ${checked ? "checkbox__container--checked" : ""}`}>
        <input
            id={id}
            type="checkbox"
            className="checkbox"
            defaultChecked={checked}
            onClick={(e) => onClick(e.target.checked)}
        />
        <div className="checkbox__icon-container">
            <SVG
                src={checked ? IcCheckboxChecked : IcCheckboxEmpty}
                onClick={() => onClick(!checked)}
            />
        </div>
        <label htmlFor={id} className="p2">
            {label}
        </label>
    </div>
);

Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default Checkbox;
