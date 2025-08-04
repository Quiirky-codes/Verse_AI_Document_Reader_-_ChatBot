import React, { useRef } from 'react';
import { LogoIcon, UploadIcon, NewChatIcon, HistoryIcon } from './Icons';

const ActionButton = ({ action, text, onClick, disabled }) => (
    <button
        onClick={() => onClick(action, text)}
        disabled={disabled}
        className="action-btn w-full text-left glass-effect hover:bg-white/20 transition-all duration-300 text-white py-3 px-4 rounded-xl disabled:cursor-not-allowed"
    >
        {text}
    </button>
);

const Sidebar = ({
    fileName,
    fileStatus,
    isChatActive,
    onFileUpload,
    onAction,
    onNewChat,
    onShowHistory,
}) => {
    const fileInputRef = useRef(null);

    const getFileNameColor = () => {
        switch (fileStatus) {
            case 'uploading': return 'text-yellow-400';
            case 'success': return 'text-blue-300';
            case 'error': return 'text-red-400';
            default: return 'text-gray-300';
        }
    };
    
    return (
        <aside id="sidebar" className="w-full md:w-80 lg:w-96 p-6 flex flex-col space-y-6 transition-all duration-300">
            <div className="flex items-center space-x-3">
                <LogoIcon className="text-blue-400" />
                <h1 className="text-2xl font-bold">Verse</h1>
            </div>

            <div className="glass-effect rounded-2xl p-4 flex flex-col items-center text-center">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.txt,.md,.docx"
                    ref={fileInputRef}
                    onChange={(e) => onFileUpload(e.target.files[0])}
                />
                <button
                    id="upload-button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full glass-effect hover:bg-white/20 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                >
                    <UploadIcon />
                    <span>Upload Document</span>
                </button>
                <p id="file-name" className={`text-sm mt-3 truncate ${getFileNameColor()}`}>
                    {fileName}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, TXT, MD, DOCX</p>
            </div>

            <div className="glass-effect rounded-2xl p-4 space-y-3">
                <h2 className="text-lg font-semibold mb-2">Chat</h2>
                <button onClick={onNewChat} className="w-full text-left glass-effect hover:bg-white/20 transition-all duration-300 text-white py-3 px-4 rounded-xl flex items-center space-x-2">
                    <NewChatIcon />
                    <span>New Chat</span>
                </button>
                <button onClick={onShowHistory} className="w-full text-left glass-effect hover:bg-white/20 transition-all duration-300 text-white py-3 px-4 rounded-xl flex items-center space-x-2">
                    <HistoryIcon />
                    <span>Chat History</span>
                </button>
            </div>

            <div className={`glass-effect rounded-2xl p-4 space-y-3 transition-opacity ${!isChatActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <h2 className="text-lg font-semibold mb-2">Actions</h2>
                <ActionButton action="summarize" text="Summarize Document" onClick={onAction} disabled={!isChatActive} />
                <ActionButton action="sections" text="Section-wise Summary" onClick={onAction} disabled={!isChatActive} />
                <ActionButton action="faqs" text="Generate FAQs" onClick={onAction} disabled={!isChatActive} />
                <ActionButton action="extract" text="Extract Entities & Keywords" onClick={onAction} disabled={!isChatActive} />
            </div>

            <div className="flex-grow"></div>
            <p className="text-xs text-center text-gray-500">Built with React by quiirky-codes</p>
        </aside>
    );
};

export default Sidebar;