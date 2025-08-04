import React, { useState } from 'react';
import { SendIcon } from './Icons';

const ChatInput = ({ onQuery, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onQuery(input);
            setInput('');
        }
    };

    return (
        <div className="p-6">
            <form
                onSubmit={handleSubmit}
                id="chat-input-container"
                className={`glass-effect rounded-2xl flex items-center p-2 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your document..."
                    className="flex-1 bg-transparent p-3 text-white placeholder-gray-400 focus:outline-none"
                    disabled={disabled}
                />
                <button
                    id="send-button"
                    type="submit"
                    disabled={disabled || !input.trim()}
                    className="glass-effect hover:bg-white/20 transition-all duration-300 text-white font-semibold p-3 rounded-xl ml-2 disabled:cursor-not-allowed"
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;