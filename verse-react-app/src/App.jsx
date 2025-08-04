import React from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { useChat } from './hooks/useChat';

function App() {
  const {
    messages,
    fileName,
    fileStatus,
    isProcessing,
    isChatActive,
    chatHistory,
    view,
    setView,
    handleFileUpload,
    handleAction,
    handleQuery,
    startNewChat,
    loadChat,
    deleteChat
  } = useChat();

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white font-sans antialiased">
      <div className="flex h-screen max-h-screen">
        <Sidebar
          fileName={fileName}
          fileStatus={fileStatus}
          isChatActive={isChatActive}
          onFileUpload={handleFileUpload}
          onAction={handleAction}
          onNewChat={startNewChat}
          onShowHistory={() => setView('history')}
        />
        <Main
          view={view}
          messages={messages}
          isProcessing={isProcessing}
          isChatActive={isChatActive}
          chatHistory={chatHistory}
          onQuery={handleQuery}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
        />
      </div>
    </div>
  );
}

export default App;