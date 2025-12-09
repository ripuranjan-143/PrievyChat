import { useState } from 'react';
import Navbar from '../components/NavigationBar.jsx';
import MyChats from './ChatList.jsx';
import ChatBox from './ChatContainer.jsx';
import { useAuth } from '../../src/contexts/AuthContext.jsx';

function ChatPage() {
  const [fetchAgain, setFetchAgain] = useState(false);

  const { currentUser } = useAuth();

  return (
    <div className="w-100">
      {currentUser && <Navbar setFetchAgain={setFetchAgain} />}
      <div style={{ height: '90.6vh', display: 'flex' }}>
        {currentUser && <MyChats fetchAgain={fetchAgain} />}
        {currentUser && (
          <ChatBox
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
