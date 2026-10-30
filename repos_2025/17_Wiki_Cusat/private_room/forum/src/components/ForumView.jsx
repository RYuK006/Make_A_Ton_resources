import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
    MessageSquare,
    Send,
    Image as ImageIcon,
    X,
    ThumbsUp,
    ThumbsDown,
    MoreHorizontal,
    CornerDownRight,
    User,
    Clock,
    Flame
} from 'lucide-react';
import { useForum } from '../lib/useForum';

// Sub-component for an individual message bubble
const MessageBubble = ({ message, onReply, onVote, depth = 0 }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const currentUser = localStorage.getItem('wiki_user_name') || 'Campus User';
    const isAuthor = message.sender_name === currentUser;

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        await onReply(replyContent, message.id);
        setReplyContent('');
        setIsReplying(false);
    };

    return (
        <div className={`relative transition-all duration-300 ${depth > 0 ? 'ml-6 md:ml-12 mt-4' : 'mt-8'}`}>
            {/* Visual connector for threads */}
            {depth > 0 && (
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/30 to-transparent"></div>
            )}

            <div className={`group relative p-5 rounded-2xl border transition-all ${depth === 0
                    ? 'bg-gray-900/40 border-gray-800 hover:border-gray-700 shadow-xl'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isAuthor ? 'bg-orange-500/10' : 'bg-gray-800'}`}>
                            <User size={14} className={isAuthor ? 'text-orange-500' : 'text-gray-400'} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isAuthor ? 'text-orange-500' : 'text-gray-300'}`}>
                                {message.sender_name} {isAuthor && <span className="text-[10px] opacity-60 ml-1">(You)</span>}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Clock size={10} />
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col md:flex-row gap-6">
                    {message.media_url && (
                        <div className="flex-shrink-0 w-full md:w-48 overflow-hidden rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                            <img
                                src={message.media_url}
                                alt="Shared media"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>

                        {/* Actions */}
                        <div className="mt-5 flex items-center gap-6">
                            <div className="flex items-center bg-black/40 rounded-full px-2 py-1 border border-white/5">
                                <button
                                    onClick={() => onVote(message.id, 'like')}
                                    className="p-1.5 hover:text-orange-500 transition-colors flex items-center gap-1.5"
                                >
                                    <ThumbsUp size={14} className={message.likes > 0 ? 'fill-orange-500 text-orange-500' : ''} />
                                    <span className="text-[11px] font-bold">{message.likes || 0}</span>
                                </button>
                                <div className="w-px h-3 bg-white/10 mx-1"></div>
                                <button
                                    onClick={() => onVote(message.id, 'dislike')}
                                    className="p-1.5 hover:text-red-500 transition-colors flex items-center gap-1.5"
                                >
                                    <ThumbsDown size={14} className={message.dislikes > 0 ? 'fill-red-500 text-red-500' : ''} />
                                    <span className="text-[11px] font-bold">{message.dislikes || 0}</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${isReplying ? 'text-orange-500' : 'text-gray-500 hover:text-orange-400'
                                    }`}
                            >
                                <MessageSquare size={14} />
                                {isReplying ? 'Cancel' : 'Reply'}
                            </button>
                        </div>

                        {/* Inline Reply Form */}
                        {isReplying && (
                            <form onSubmit={handleReplySubmit} className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="relative">
                                    <textarea
                                        autoFocus
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Write your response..."
                                        className="w-full bg-black/60 border border-orange-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 transition-all resize-none"
                                        rows={2}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 bottom-2 p-2 bg-orange-600 rounded-lg text-white hover:bg-orange-500 active:scale-95 transition-all"
                                    >
                                        <Send size={14} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Recursive Replies */}
            {message.replies && message.replies.length > 0 && (
                <div className="relative">
                    {message.replies.map(reply => (
                        <MessageBubble
                            key={reply.id}
                            message={reply}
                            onReply={onReply}
                            onVote={onVote}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ForumView = ({ roomId = 'general' }) => {
    const { messages, loading, error, postMessage, vote } = useForum(roomId);
    const [newPost, setNewPost] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleMainSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim() && !file) return;

        setIsPosting(true);
        try {
            await postMessage(newPost, null, file);
            setNewPost('');
            clearFile();
        } catch (err) {
            alert('Failed to post. Check connection.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-gradient leading-none mb-2 underline decoration-orange-500/30">
                        CAMPUS_FORUM
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Live Discussion Feed</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{roomId}</span>
                </div>
            </div>

            {/* Main Input Box */}
            <div className="mb-16 bg-gradient-to-br from-gray-900 to-black p-1 rounded-[2rem] shadow-2xl border border-white/5">
                <form onSubmit={handleMainSubmit} className="bg-[#0a0a0a] rounded-[1.8rem] p-6">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind today?"
                        className="w-full bg-transparent border-none text-lg text-gray-200 placeholder:text-gray-700 outline-none resize-none min-h-[120px]"
                    />

                    {preview && (
                        <div className="relative inline-block mt-4">
                            <img src={preview} alt="upload" className="h-32 w-32 object-cover rounded-2xl border border-white/10" />
                            <button
                                type="button"
                                onClick={clearFile}
                                className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow-xl hover:bg-orange-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-4">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all group"
                            >
                                <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isPosting || (!newPost.trim() && !file)}
                            className="px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 rounded-2xl text-sm font-black italic tracking-wider flex items-center gap-3 shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all active:scale-95"
                        >
                            {isPosting ? 'SIGNALING...' : 'SEND SIGNAL'}
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Message Feed */}
            <div className="space-y-12">
                {loading && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Flame size={48} className="text-gray-800 mb-4" />
                        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Searching for frequencies...</p>
                    </div>
                ) : error ? (
                    <div className="p-10 rounded-3xl border border-red-500/20 bg-red-500/5 text-center">
                        <p className="text-red-400 font-bold mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase tracking-widest underline opacity-60">Reboot Stream</button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/5 rounded-[3rem]">
                        <MessageSquare size={48} className="mx-auto text-gray-800 mb-6" />
                        <h3 className="text-xl font-bold mb-2 italic">Silent Frequencies</h3>
                        <p className="text-gray-600 text-sm">Be the first to break the silence on this room.</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onReply={postMessage}
                            onVote={vote}
                        />
                    ))
                )}
            </div>

            <div className="h-20"></div>
        </div>
    );
};
