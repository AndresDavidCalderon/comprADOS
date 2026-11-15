import "./FieldTitle.css";
import Checkbox from '@mui/material/Checkbox';

export default function FieldTitle({ icon, title, onSetOverride,required = false, overriden }) {
    return (
        <div className="product-edit-field-title">
            <div className="field-title-main">
            <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
            {title} {required && <span className="required-asterisk">*</span>}
            </div>
            <div className="field-title-checkbox-container">
            {onSetOverride && (
                <Checkbox className="field-title-override-checkbox" checked={overriden} onChange={onSetOverride} />
            )}
            </div>
        </div>
    );
}