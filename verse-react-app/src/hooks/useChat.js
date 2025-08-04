import { useState, useEffect, useCallback } from 'react';
import { uploadDocument, performAction, askQuestion } from '../api/verseApi';

const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const WELCOME_MESSAGE = {
    id: 'welcome',
    sender: 'bot',
    text: "Hello! I'm your AI document assistant. Please upload a document to get started. You can ask me to summarize it, generate FAQs, or ask specific questions about its content.",
};

export const useChat = () => {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [fileName, setFileName] = useState('No file selected.');
    const [fileStatus, setFileStatus] = useState('default'); // default, uploading, success, error
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Chat History State
    const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('verseAI_chatHistory') || '[]'));
    const [currentChatId, setCurrentChatId] = useState(generateChatId);
    const [view, setView] = useState('chat'); // 'chat' or 'history'

    // --- Chat Persistence ---
    useEffect(() => {
        const currentChat = chatHistory.find(c => c.id === currentChatId);
        // Don't save initial welcome message or empty chats
        if (messages.length > 1 && !currentChat?.isSaved) {
            const updatedHistory = [
                { id: currentChatId, fileName, messages, timestamp: new Date().toISOString() },
                ...chatHistory.filter(c => c.id !== currentChatId)
            ].slice(0, 10); // Limit history size
            
            setChatHistory(updatedHistory);
            localStorage.setItem('verseAI_chatHistory', JSON.stringify(updatedHistory));
        }
    }, [messages, fileName, currentChatId, chatHistory]);


    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, text }]);
    };

    const handleFileUpload = useCallback(async (file) => {
        if (!file) return;

        setFileName('Uploading & Processing...');
        setFileStatus('uploading');
        addMessage('user', `Uploading file: ${file.name}`);
        setIsProcessing(true);

        try {
            const result = await uploadDocument(file);
            setFileName(file.name);
            setFileStatus('success');
            addMessage('bot', result.message || 'Document processed successfully!');
        } catch (error) {
            setFileName('Upload failed.');
            setFileStatus('error');
            addMessage('bot', `Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    }, []);
    
    const handleAction = useCallback(async (action, promptText) => {
        addMessage('user', promptText);
        setIsProcessing(true);
        try {
            const result = await performAction(action);
            addMessage('bot', result);
        } catch (error) {
            addMessage('bot', `Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleQuery = useCallback(async (query) => {
        if (!query) return;
        addMessage('user', query);
        setIsProcessing(true);
        try {
            const answer = await askQuestion(query);
            addMessage('bot', answer);
        } catch (error) {
            addMessage('bot', `Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    }, []);
    
    // --- History Management ---
    const startNewChat = () => {
        setCurrentChatId(generateChatId());
        setMessages([WELCOME_MESSAGE]);
        setFileName('No file selected.');
        setFileStatus('default');
        setView('chat');
    };

    const loadChat = (chatId) => {
        const chat = chatHistory.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chat.id);
            setMessages(chat.messages);
            setFileName(chat.fileName || 'No file selected.');
            setFileStatus(chat.fileName ? 'success' : 'default');
            setView('chat');
        }
    };

    const deleteChat = (chatId) => {
        const updatedHistory = chatHistory.filter(c => c.id !== chatId);
        setChatHistory(updatedHistory);
        localStorage.setItem('verseAI_chatHistory', JSON.stringify(updatedHistory));
    };

    const isChatActive = fileStatus === 'success';

    return {
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
    };
};