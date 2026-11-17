import "./FieldTitle.css";
import Checkbox from '@mui/material/Checkbox';

export default function FieldTitle({ icon, title, onSetOverride, required = false, overriden, className = "product-edit-field-title" }) {
    return (
        <div className={className}>
            <div className="field-title-main">
            <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
            {title} {required && <span className="required-asterisk">*</span>}
            </div>
            {onSetOverride && (
                <div className="field-title-checkbox-container">
                        <Checkbox className="field-title-override-checkbox" checked={overriden} onChange={(event) => onSetOverride(event.target.checked)} />
                </div>
            )}
        </div>
    );
}