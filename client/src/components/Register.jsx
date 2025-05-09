import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import "../style/Register.css";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const { register, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      address: "",
      phoneNumber: "",
      website: "",
      password: ""
    },
  });

  const { error, flag, setFlag, checkExistingUser, finalregister } = useAuth();

  const onInitSubmit = async (data) => {
    const success = await checkExistingUser(
      data.email,
      password,
      verifyPassword
    );
    if (success) {
      setFlag(true);
    }
  };

  const onSubmit = async (data) => {
    const user = await finalregister(data, password);
    if (user) {
      navigate(`/users/${user.id}/home`);
    }
  };

  const registerOptions = {
    userName: { required: true, minLength: 3 },
    password: { required: true, minLength: 6 },
    verifyPassword: {
      required: true,
      validate: (value) => value === password || "Passwords do not match",
    },
    email: { required: true, pattern: /^\S+@\S+$/i },
    phone: { required: true, pattern: /^[0-9]{10}$/ },
  };

  return (
    <main className="main-login">
      <div className="right-login">
        <div className="card-login">
          <h1>Sign Up</h1>
          {!flag && (
            <form onSubmit={handleSubmit(onInitSubmit)}>
              <div className="textfield">
                <label htmlFor="username">Email</label>
                <input
                  type="email"
                  {...register("email", registerOptions.email)}
                  placeholder="User"
                />
              </div>
              <div className="textfield">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="textfield">
                <label htmlFor="verifyPassword">Verify Password</label>
                <input
                  type="password"
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  placeholder="Verify Password"
                />
              </div>
              <div className="error">{error}</div>
              <button className="btn-login" type="submit">
                Next
              </button>
            </form>
          )}
          {flag && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="textfield">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  {...register("", registerOptions.userName)}
                  placeholder="Name"
                />
              </div>
              <div className="textfield">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  {...register("email", registerOptions.email)}
                  placeholder="Email"
                />
              </div>
              <div className="textfield">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  {...register("phone", registerOptions.phone)}
                  placeholder="Phone"
                />
              </div>
              <div className="textfield">
                <label htmlFor="phone">Website</label>
                <input
                  type="text"
                  {...register("Website", registerOptions.Website)}
                  placeholder="Phone"
                />
              </div>

              <button className="btn-login" type="submit">
                Submit
              </button>
            </form>
          )}
          <Link to="/login" className='login'>Allready Have An Account Yet?</Link>
        </div>
      </div>
    </main>
  );
}

export default Register;
