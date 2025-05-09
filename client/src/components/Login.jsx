import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "MOSHeE@example.com",
      password: "123456",
    },
  });

  const { error, login } = useAuth();

  const onSubmit = async (data) => {
    const user = await login(data);
    if (user) {
      navigate(`/users/${user.id}/home`);
      return;
    }
  };

  return (
    <main className='main-login'>
      <div className="right-login">
        <div className="card-login">
          <h1>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="textfield">
              <label htmlFor="user">Email</label>
              <input
                type="email"
                name="user"
                placeholder="Email"
                required
                {...register("email", { required: true })}
              />
            </div>
            <div className="textfield">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                {...register("password", { required: true })}
              />
            </div>
            <button className="btn-login" type="submit">Login</button>
            <Link to="/register" className='signUp'>Dont Have An Account Yet?</Link>

          </form>
        </div >
      </div>
    </main >
  );
}

export default Login;
