import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const USER_DETAILS_DEFAULT = {
  username: "",
  password: "",
  confirm: "", // This field doesn't need to be sent to the server, may want to strip it before it's embedded in the post body
  email: "",
  firstName: "",
  lastName: ""
};

function Register() {
  // State
  const [userDetails, setUserDetails] = useState(USER_DETAILS_DEFAULT);
  const [errors, setErrors] = useState([]); // Registration validation errors
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/register";

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors([]);

    if (userDetails.password !== userDetails.confirm) {
      setErrors(["Password & Confirm Password fields do not match!"]);
    } else {
      console.log(`SUBMITTING: ${JSON.stringify(userDetails)}`);
      registerUser(); 
    }
  };

  const handleChange = (event) => {
    const newUserDetails = {...userDetails};

    newUserDetails[event.target.name] = event.target.value;
    setUserDetails(newUserDetails);
  };

  // This just registers the user, it DOES NOT log them in!
  // So, after we get a successful register, it may be a good idea to prompt the user to go to the login page & log in!
  const registerUser = () => {
    const post = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    };

    fetch(url, post)
      .then(response => {
        if (response.status !== 200 || response.status === 400) { // Either got the token, or validation errors
          return response.json();
        } else {
          return Promise.reject(`Registration failed! Status code: ${response.status}`);
        }
      })
      .then(data => { // Handle token
        if (data.jwt_token) { // If we got a token, we successfully registered a new account! Store it, then navigate home.
          console.log(`Got Token: ${data.jwt_token}`);
          console.log("TODO: Store token for use in the header of authenticated requests throughout application");
          navigate('/');
        } else { // Validation errors!
          setErrors(data);
        }
      })
      .catch(console.log);
  };
  
  return (
    <>
      <section className="border rounded p-3 mt-5" id="userLoginFormContainer">
        <h2 className="text-center mt-3">Create Account</h2>
        {errors.length > 0 && (
          <div className="alert alert-danger pt-1 pb-1" id="error">
            <p className="text-center m-0">Encountered The Following Errors:</p>
            <ul>
              {errors.map(e => (<li key={e}>{e}</li>))}
            </ul>
          </div>
        )}
        <form className="" onSubmit={handleSubmit}>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <input className="form-control" type="text" id="username" name="username" value={userDetails.username} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-control" type="password" id="password" name="password" value={userDetails.password} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <input className="form-control" type="password" id="conform" name="confirm" value={userDetails.confirm} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-control" type="email" id="email" name="email" value={userDetails.email} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="firstName">First Name</label>
            <input className="form-control" type="text" id="firstName" name="firstName" value={userDetails.firstName} onChange={handleChange} />
          </fieldset>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="lastName">Last Name</label>
            <input className="form-control" type="text" id="lastName" name="lastName" value={userDetails.lastName} onChange={handleChange} />
          </fieldset>
          <button className="btn" type="submit" id="formSubmit">Create Account</button>
          <Link className="btn float-end" to={`/login`}>Have An Account? Log in Here!</Link>
        </form>
      </section>
    </>
  );
}

export default Register;
