import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../style/Error.css";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-modal show">
      <h1>Page Not Found</h1>

      <button className="" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
