import React from 'react';
import { HistoryIcon, DeleteIcon } from './Icons';

const ChatHistoryView = ({ history, onLoadChat, onDeleteChat }) => {
    if (history.length === 0) {
        return (
             <div className="flex items-start space-x-4 message-fade-in p-6">
                <div className="bg-blue-500 p-2 rounded-full flex-shrink-0">
                    <HistoryIcon />
                </div>
                <div className="glass-effect rounded-2xl p-4 max-w-lg">
                    <p className="font-semibold mb-1">Verse AI</p>
                    <p className="text-gray-200">No chat history found. Start a new chat to begin!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 overflow-y-auto h-full">
            <div className="flex items-start space-x-4 message-fade-in">
                 <div className="bg-blue-500 p-2 rounded-full flex-shrink-0">
                    <HistoryIcon />
                </div>
                <div className="glass-effect rounded-2xl p-4 max-w-2xl w-full">
                    <p className="font-semibold mb-3">Chat History</p>
                    <div className="space-y-2">
                        {history.map(chat => (
                            <div key={chat.id} className="glass-effect rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all duration-300" onClick={() => onLoadChat(chat.id)}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-sm">{chat.fileName || 'No document'}</p>
                                        <p className="text-xs text-gray-400">{new Date(chat.timestamp).toLocaleString()}</p>
                                        <p className="text-xs text-gray-300 mt-1">{chat.messages.length} messages</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat.id);
                                        }}
                                        className="text-red-400 hover:text-red-300 text-xs p-1"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHistoryView;