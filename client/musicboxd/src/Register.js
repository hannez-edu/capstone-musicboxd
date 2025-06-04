import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const USER_DETAILS_DEFAULT = {
  userName: "",
  password: "",
  confirm: "",
  email: "",
  firstName: "",
  lastName: ""
};

function Register() {
  // State
  const [userDetails, setUserDetails] = useState(USER_DETAILS_DEFAULT);
  const [errors, setErrors] = useState([]); // Registration validation errors
  const [created, setCreated] = useState(false); // Set to true if an account was successfully created.
  const navigate = useNavigate();
  const url = "http://localhost:8080/api/user/register";

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
        if (data.userId) { // If we got a user back, we successfully registered a new account!
          console.log(data);
          setCreated(true);
        } else { // Validation errors!
          setErrors(data);
        }
      })
      .catch(console.log);
  };
  
  return (
    <div className="container d-flex align-items-center justify-content-center">
      <section className="border rounded p-3 mt-5 w-50" id="userLoginFormContainer">
        <h2 className="text-center mt-3">Create Account</h2>
        {errors.length > 0 && (
          <div className="alert alert-danger pt-1 pb-1" id="error">
            <p className="text-center m-0">Encountered The Following Errors:</p>
            <ul>
              {errors.map(e => (<li key={e}>{e}</li>))}
            </ul>
          </div>
        )}
        {created && (
          <div className="alert alert-success pt-1 pb-1" id="">
            <p className="text-center m-0">Account Successfully Created!</p>
            <p className="text-center m-0">Log in & get reviewing!</p>
          </div>
        )}
        <form className="" onSubmit={handleSubmit}>
          <fieldset className="mb-3">
            <label className="form-label" htmlFor="userName">Username</label>
            <input className="form-control" type="text" id="userName" name="userName" value={userDetails.userName} onChange={handleChange} />
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
          {!created && (
            <div>
              <button className="btn btn-primary" type="submit" id="formSubmit">Create Account</button>
              <Link className="btn btn-secondary float-end" to={`/login`}>Have An Account? Log in Here!</Link>
            </div>
          )}
          {created && (
            <div className="container d-flex align-items-center justify-content-center">
              <Link className="btn btn-primary float-end" to={`/login`}>Log in Here!</Link>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default Register;
