function ChatInput({
  newMessage,
  typingHandler,
  handleKeyPress,
  handleSendMessage,
}) {
  return (
    <div className="input-group">
      <input
        value={newMessage}
        onChange={typingHandler}
        onKeyDown={handleKeyPress}
        style={{ height: '50px' }}
        type="text"
        className="form-control mt-1 border-dark"
        placeholder="Enter your message…"
      />
      <button
        onClick={() => handleSendMessage()}
        style={{
          height: '50px',
          backgroundColor: '#38B2AC',
        }}
        className="btn mt-1 border-dark hover-colour"
        type="button"
      >
        <i className="fa-regular fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default ChatInput;
