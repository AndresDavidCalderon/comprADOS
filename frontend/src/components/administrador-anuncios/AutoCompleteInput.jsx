import Fuse from "fuse.js";
import { useState } from "react";
import "./AdvertsManager.css";

export default function AutoCompleteInput({ suggestions = [], onSelect }) {
    const [inputValue, setInputValue] = useState("");
    const [focused, setFocused] = useState([false, false]);

    const filteredSuggestions =
        inputValue.length === 0
            ? suggestions
            : new Fuse(suggestions, { includeScore: true, threshold: 0.3 })
                .search(inputValue)
                .map((result) => result.item);
    
    const onSelectSuggestion = (suggestion) => {
        setInputValue(suggestion);
        onSelect?.(suggestion);
    }

    return (
        <>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="textarea-input"
                onFocus={() => setFocused([true, focused[1]])}
                onBlur={() => setFocused([false, focused[1]])}
            />
            {(focused[0] || focused[1]) && (
                <div>
                    {filteredSuggestions.map((suggestion) => (
                        <button key={suggestion} 
                        type="button" 
                        onClick={() => onSelectSuggestion(suggestion)}
                        onFocus={() => setFocused([focused[0], true])}
                        onBlur={() => setFocused([focused[0], false])}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}