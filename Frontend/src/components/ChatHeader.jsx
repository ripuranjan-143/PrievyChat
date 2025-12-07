import AvatarRow from './AvatarRow';
import ProfileModal from './ProfileModal';
import GroupChatSettingsModal from '../pages/GroupChatSettingsModal.jsx';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

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
  const { onlineUsers } = useSocket();
  const { currentUser } = useAuth();

  // check if other user is online (for single chat)
  const isOtherUserOnline = otherUser
    ? onlineUsers.includes(otherUser._id)
    : false;

  // check if any user in group is online (excluding current user)
  const isGroupOnline =
    selectedChat?.isGroupChat &&
    selectedChat?.users?.some(
      (user) =>
        user._id !== currentUser._id && onlineUsers.includes(user._id)
    );

  const showOnlineStatus = selectedChat?.isGroupChat
    ? isGroupOnline
    : isOtherUserOnline;

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
                isOnline={isOtherUserOnline}
                showStatus={true}
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
                isOnline={isGroupOnline}
                showStatus={true}
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
