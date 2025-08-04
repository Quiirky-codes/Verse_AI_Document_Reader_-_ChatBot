import React, { useEffect, useRef } from 'react';
import Message from './Message';

const TypingIndicator = () => (
    <div className="flex items-start space-x-4 message-fade-in typing-indicator">
        <div className="bg-blue-500 p-2 rounded-full flex-shrink-0">
            {/* BotIcon can be used here */}
        </div>
        <div className="glass-effect rounded-2xl p-4 max-w-lg">
            <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    </div>
);


const ChatLog = ({ messages, isProcessing }) => {
    const chatLogRef = useRef(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isProcessing]);

    return (
        <div id="chat-log" ref={chatLogRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
            {messages.map((msg) => (
                <Message key={msg.id} sender={msg.sender} text={msg.text} />
            ))}
            {isProcessing && <TypingIndicator />}
        </div>
    );
};

export default ChatLog;