import { useEffect, useRef } from 'react';
import {
  isFinalMessage,
  isMessageFromDifferentSender,
  getMessageMargin,
  isPreviousMessageSameUser,
} from '../utils/ChatLogics';
import { useAuth } from '../contexts/AuthContext.jsx';

function ChatScrollView({ messages }) {
  const { currentUser } = useAuth();
  const scrollRef = useRef();

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // if no messages, show placeholder text
  if (!messages || messages.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-end text-muted"
        style={{ height: '100%', fontStyle: 'italic' }}
      >
        Send a message to start the conversation
      </div>
    );
  }

  return (
    <div
      className="px-2"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages &&
        messages.map((m, i) => {
          return (
            <div className="d-flex " key={m._id}>
              {(isMessageFromDifferentSender(
                messages,
                m,
                i,
                currentUser._id
              ) ||
                isFinalMessage(messages, i, currentUser._id)) && (
                <img
                  src={m.sender?.picture}
                  alt={m.sender.name}
                  className="rounded-circle me-2"
                  width="27"
                  height="27"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={m.sender.name}
                  style={{
                    marginTop: '7px',
                    cursor: 'pointer',
                    objectFit: 'cover',
                  }}
                />
              )}

              <span
                className={`p-2 px-3 rounded-4`}
                style={{
                  backgroundColor:
                    m.sender._id === currentUser._id
                      ? '#BEE3F8'
                      : '#B9F5D0',
                  marginLeft: getMessageMargin(
                    messages,
                    m,
                    i,
                    currentUser._id
                  ),
                  marginTop: isPreviousMessageSameUser(
                    messages,
                    m,
                    i,
                    currentUser._id
                  )
                    ? 3
                    : 10,
                  maxWidth: '75%',
                  display: 'inline-block',
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}

      {/* only render scrollRef if messages exist */}
      {messages.length > 0 && <div ref={scrollRef}></div>}
    </div>
  );
}

export default ChatScrollView;
