import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CREDS_DEFAULT = {
  username: "",
  password: "",
};

// Maintains logged-in user's token auth state across pages
const AuthService = {
  setAuth: (id, token) => {
    localStorage.setItem("userId", id.toString());
    localStorage.setItem("authToken", token);
    GlobalTokenID.id = id;
    GlobalTokenID.token = token;
  },

  getAuth: () => {
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    if (id && token) {
      GlobalTokenID.id = parseInt(id);
      GlobalTokenID.token = token;
      return { id: parseInt(id), token };
    }
    return null;
  },

  clearAuth: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    GlobalTokenID.id = null;
    GlobalTokenID.token = null;
  },

  isLoggedIn: () => {
    const auth = AuthService.getAuth();
    return auth && auth.token && auth.id;
  },
};

const GlobalTokenID = {};

// Initialize auth state from localStorage on app load
AuthService.getAuth();

function Login() {
  // State
  const [credentials, setCredentials] = useState(CREDS_DEFAULT);
  const [error, setError] = useState(false); // True if we encountered an error during a login attempt.
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/user/authenticate";

  // Check if already logged in on component mount
  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser();
  };

  const handleChange = (event) => {
    const newCreds = { ...credentials };

    newCreds[event.target.name] = event.target.value;
    setCredentials(newCreds);
  };

  // Retrieves the token & userId, then sets those values to GlobalTokenID available as an export globally.
  const authenticateUser = () => {
    const post = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    };

    fetch(url, post)
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          // Login failed (403)
          setError(true);
          return Promise.reject(
            `Login failed! Status code: ${response.status}`
          );
        }
      })
      .then((data) => {
        // Use AuthService
        AuthService.setAuth(parseInt(data.id), data.jwt_token);
        navigate("/");
      })
      .catch(console.log);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <section className="border rounded p-3 mt-5" id="userLoginFormContainer">
        <h2 className="text-center mt-3">Welcome Back!</h2>
        {error && (
          <div className="alert alert-danger pt-1 pb-1" id="error">
            <p className="text-center m-0">Login failed. Please try again!</p>
          </div>
        )}
        <form className="" onSubmit={handleSubmit}>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-control"
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
            />
          </fieldset>
          <button
            className="btn btn-primary me-5"
            type="submit"
            id="formSubmit"
          >
            Login
          </button>
          <Link className="btn btn-secondary ms-5 float-end" to={`/register`}>
            Create New Account
          </Link>
        </form>
      </section>
    </div>
  );
}

export default Login;
export { GlobalTokenID, AuthService };
