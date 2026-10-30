import React from 'react';
import { ForumView } from './components/ForumView';

function App() {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room') || 'general';

    return (
        <div className="min-h-screen bg-[#050505]">
            <ForumView roomId={room} />
        </div>
    );
}

export default App;
