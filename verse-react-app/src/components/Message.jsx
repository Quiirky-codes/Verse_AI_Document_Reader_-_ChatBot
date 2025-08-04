import React from 'react';
import { BotIcon, UserIcon } from './Icons';

// This function converts the **bold** syntax to <strong> HTML tags
// and prepares it for safe rendering.
const createMarkup = (text) => {
    const boldedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: boldedText };
};

const Message = ({ sender, text }) => {
    const isBot = sender === 'bot';

    return isBot ? (
        <div className="flex items-start space-x-4 message-fade-in">
            <div className="bg-blue-500 p-2 rounded-full flex-shrink-0"><BotIcon /></div>
            <div className="glass-effect rounded-2xl p-4 max-w-lg">
                <p className="font-semibold mb-1">Verse AI</p>
                <p 
                    className="text-gray-200 whitespace-pre-wrap" 
                    dangerouslySetInnerHTML={createMarkup(text)} 
                />
            </div>
        </div>
    ) : (
        <div className="flex items-start justify-end space-x-4 message-fade-in">
            <div className="glass-effect bg-blue-600/50 rounded-2xl p-4 max-w-lg"><p>{text}</p></div>
            <div className="bg-gray-600 p-2 rounded-full flex-shrink-0"><UserIcon /></div>
        </div>
    );
};

export default Message;