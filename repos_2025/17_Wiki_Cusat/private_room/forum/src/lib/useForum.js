import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './api';

export const useForum = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const organizeThreads = useCallback((allMessages) => {
        const messageMap = {};
        const roots = [];

        // First pass: create map
        allMessages.forEach(msg => {
            messageMap[msg.id] = { ...msg, replies: [] };
        });

        // Second pass: link replies to parents
        allMessages.forEach(msg => {
            if (msg.parent_id && messageMap[msg.parent_id]) {
                messageMap[msg.parent_id].replies.push(messageMap[msg.id]);
            } else if (!msg.parent_id) {
                roots.push(messageMap[msg.id]);
            }
        });

        // Sort roots by date (newest first for threads)
        return roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            const data = await api.getMessages(roomId);
            setMessages(organizeThreads(data || []));
            setError(null);
        } catch (err) {
            console.error('Forum Fetch Error:', err);
            setError('Unable to connect to the forum network.');
        } finally {
            setLoading(false);
        }
    }, [roomId, organizeThreads]);

    useEffect(() => {
        fetchMessages();

        // Real-time WebSocket setup
        const connectWS = () => {
            try {
                const ws = new WebSocket(api.getWebSocketUrl(roomId));

                ws.onmessage = (event) => {
                    // Refresh on any update broadcast
                    fetchMessages();
                };

                ws.onclose = () => {
                    // Try to reconnect after a delay
                    setTimeout(connectWS, 3000);
                };

                ws.onerror = () => {
                    ws.close();
                };

                socketRef.current = ws;
            } catch (e) {
                console.error('WebSocket Error:', e);
            }
        };

        connectWS();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [roomId, fetchMessages]);

    const postMessage = async (content, parentId = null, file = null) => {
        try {
            let mediaUrl = null;
            if (file) {
                const uploadRes = await api.uploadImage(file);
                // Handle both relative and absolute URLs from backend
                mediaUrl = uploadRes.url.startsWith('http')
                    ? uploadRes.url
                    : `http://127.0.0.1:8001${uploadRes.url}`;
            }

            const userName = localStorage.getItem('wiki_user_name') || 'Campus User';

            await api.createMessage({
                room_id: roomId,
                parent_id: parentId,
                content,
                sender_name: userName,
                is_anonymous: false,
                media_url: mediaUrl,
                media_type: mediaUrl ? 'image' : null
            });

            return true;
        } catch (err) {
            console.error('Post Error:', err);
            throw err;
        }
    };

    const vote = async (messageId, type) => {
        try {
            const userName = localStorage.getItem('wiki_user_name') || 'Campus User';
            await api.voteMessage(messageId, userName, type);
            // WS will trigger refresh automatically
        } catch (err) {
            console.error('Vote Error:', err);
        }
    };

    return {
        messages,
        loading,
        error,
        refresh: fetchMessages,
        postMessage,
        vote
    };
};
