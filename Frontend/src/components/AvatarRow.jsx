function AvatarRow({
  img,
  name,
  size = 40,
  className = '',
  isOnline = false,
  showStatus = false,
}) {
  return (
    <div
      className={`d-flex align-items-center hover-colour rounded px-2 py-1 ${className} `}
      style={{ cursor: 'pointer' }}
    >
      <div className="position-relative">
        <img
          src={
            img ||
            'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
          }
          alt="User Avatar"
          className="rounded-circle me-2"
          style={{
            width: `${size}px`,
            height: `${size - 3}px`,
            objectFit: 'cover',
          }}
        />
        {showStatus && isOnline && (
          <span
            className="position-absolute rounded-circle border border-white"
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              bottom: '8px',
              right: '8px',
            }}
          ></span>
        )}
      </div>
      <div className="d-flex flex-column">
        <span className="fw-semibold text-dark">{name}</span>
        {showStatus && (
          <span
            style={{
              fontSize: '12px',
              color: isOnline ? '#10b981' : '#6b7280',
            }}
          >
            {isOnline ? 'online' : 'offline'}
          </span>
        )}
      </div>
    </div>
  );
}

export default AvatarRow;
