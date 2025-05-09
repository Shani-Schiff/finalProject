import PropTypes from "prop-types";
import "../style/Info.css";

function Info(props) {
  const { userInfo, onClose } = props;
  if (!userInfo) return null;

  return (
    <div id='myInfo'>
      <div className="user-card">
        <h2>{userInfo.name}</h2>
        <p><b>Email:</b> {userInfo.email}</p>
        <p><b>Phone:</b> {userInfo.phoneNumber}</p>

        <div className="address">
          <h3>Address</h3>
          <p>{userInfo.address}</p>
        </div>
      </div>
    </div>
  );
}

Info.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bs: PropTypes.string.isRequired,
      catchPhrase: PropTypes.string.isRequired,
    }).isRequired,
    address: PropTypes.shape({
      street: PropTypes.string.isRequired,
      suite: PropTypes.string,
      city: PropTypes.string.isRequired,
      zipcode: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Info;
