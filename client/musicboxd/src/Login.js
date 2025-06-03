import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CREDS_DEFAULT = {
  username: "",
  password: ""
};

function Login() {
  // State
  const [credentials, setCredentials] = useState(CREDS_DEFAULT);
  const [error, setError] = useState(false); // True if we encountered an error during a login attempt.
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/authenticate";

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateUser();
  };

  const handleChange = (event) => {
    const newCreds = {...credentials};

    newCreds[event.target.name] = event.target.value;
    setCredentials(newCreds);
  };

  // This will retrieve the token from the Backend when security is implemented by sending the username & password.
  // TODO: Figure out how we're going to store the token after we retrieve it so it can be bundled as a header with all requests requiring authentication later ******************
  const authenticateUser = () => {
    const post = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    };

    fetch(url, post)
      .then(response => {
        if (response.status !== 200) { // OK - must deal with token.
          setError(false);
          return response.json();
        } else { // Login failed (403)
          setError(true);
          return Promise.reject(`Login failed! Status code: ${response.status}`);
        }
      })
      .then(data => { // Handle token - mapping between "jwt_token" & the token as a string.
        console.log(`Got Token: ${data.jwt_token}`);
        console.log("TODO: Store token for use in the header of authenticated requests throughout application");
      })
      .catch(console.log);
  };
  
  return (
    <>
      <section className="border rounded p-3 mt-5" id="userLoginFormContainer">
        <h2 className="text-center mt-3">Welcome Back!</h2>
        {error && (
          <div className="alert alert-danger pt-1 pb-1" id="error">
            <p className="text-center m-0">Login failed. Please try again!</p>
          </div>
        )}
        <form className="" onSubmit={handleSubmit}>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <input className="form-control" type="text" id="username" name="username" value={credentials.username} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-control" type="password" id="password" name="password" value={credentials.password} onChange={handleChange} />
          </fieldset>
          <button className="btn" type="submit" id="formSubmit">Login</button>
          <Link className="btn float-end" to={`/register`}>Create New Account</Link>
        </form>
      </section>
    </>
  );
}

export default Login;
