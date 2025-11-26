function AvatarRow({
  img,
  name,
  size = 40,
  className = ''
}) {
  return (
    <div
      className={`d-flex align-items-center hover-colour rounded ${className}`}
      style={{ cursor: 'pointer' }}
    >
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
      <span className="fw-semibold text-dark">{name}</span>
    </div>
  );
}

export default AvatarRow;
