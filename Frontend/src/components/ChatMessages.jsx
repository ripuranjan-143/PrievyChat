import { FadeLoader } from 'react-spinners';
import ChatScrollView from '../pages/MessageScrollView.jsx';
import TypingIndicator from './TypingIndicator';

function ChatMessages({ loading, messages, isTyping }) {
  return (
    <>
      <div
        className="d-flex flex-column justify-content-end pt-1 w-100 h-100 rounded-2 overflow-hidden pb-1"
        style={{ background: '#ecf3f2ff' }}
      >
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '100vh' }}
          >
            <FadeLoader color="#38B2AC" loading={true} size={150} />
          </div>
        ) : (
          <div className="chat-scroll overflow-auto">
            <ChatScrollView messages={messages} />
          </div>
        )}
        {isTyping && <TypingIndicator />}
      </div>
    </>
  );
}

export default ChatMessages;
