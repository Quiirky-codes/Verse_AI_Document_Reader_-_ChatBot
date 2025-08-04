import React from 'react';
import ChatLog from './ChatLog';
import ChatInput from './ChatInput';
import ChatHistoryView from './ChatHistoryView';

const Main = ({
    view,
    messages,
    isProcessing,
    isChatActive,
    chatHistory,
    onQuery,
    onLoadChat,
    onDeleteChat,
}) => {
    return (
        <main className="flex-1 flex flex-col bg-black/20 max-h-screen">
            {view === 'chat' ? (
                <>
                    <ChatLog messages={messages} isProcessing={isProcessing} />
                    <ChatInput onQuery={onQuery} disabled={!isChatActive || isProcessing} />
                </>
            ) : (
                <ChatHistoryView
                    history={chatHistory}
                    onLoadChat={onLoadChat}
                    onDeleteChat={onDeleteChat}
                />
            )}
        </main>
    );
};

export default Main;