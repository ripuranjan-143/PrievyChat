import { useAuth } from '../contexts/AuthContext';

const ProfileModel = ({ show, setShow }) => {
  const { currentUser } = useAuth();

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title text-center">
                {currentUser?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShow(false)}
              ></button>
            </div>

            <div className="modal-body text-center">
              {/* Avatar */}
              <div className="position-relative mx-auto mb-3">
                <img
                  src={currentUser?.picture}
                  alt="avatar"
                  className="rounded-circle shadow mt-4"
                  style={{
                    width: '180px',
                    height: '180px',
                    objectFit: 'cover',
                    border: '5px solid #fff',
                  }}
                />
              </div>

              <h4 className="fw-bold mb-1">{currentUser?.name}</h4>
              <p className="text-muted">{currentUser?.email}</p>
            </div>

            <div className="modal-footer border-0">
              <button
                style={{ backgroundColor: '#38B2AC' }}
                className="btn px-4 text-white btn-hover-colour" 
                onClick={() => setShow(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModel;
