import AvatarRow from './AvatarRow';
import ProfileModal from './ProfileModal';
import GroupChatSettingsModal from '../pages/GroupChatSettingsModal.jsx';

function ChatHeader({
  selectedChat,
  otherUser,
  otherName,
  groupchat,
  singleChat,
  setGroupChat,
  setSingleChat,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) {
  return (
    <>
      {/* chat header */}
      <div className="d-flex align-items-center mb-1">
        {/* back arrow button */}
        <span style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-arrow-left"></i>
        </span>

        {!selectedChat.isGroupChat ? (
          <>
            {/* for single chat */}
            <div onClick={() => setSingleChat(true)}>
              <AvatarRow
                img={otherUser?.picture}
                name={otherName}
                className="ms-3"
              />
            </div>

            {singleChat && (
              <ProfileModal
                show={singleChat}
                setShow={setSingleChat}
                user={otherUser}
              />
            )}
          </>
        ) : (
          <>
            {/* for group chat */}
            <div onClick={() => setGroupChat(true)}>
              <AvatarRow
                img={selectedChat?.picture}
                name={selectedChat.chatName.toUpperCase()}
                className="ms-3"
              />
            </div>

            {groupchat && (
              <GroupChatSettingsModal
                groupChat={groupchat}
                setGroupChat={setGroupChat}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ChatHeader;
