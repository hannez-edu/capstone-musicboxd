import { useEffect, useState } from "react";
import { AuthService } from "../Login";

const USER_DETAILS_DEFAULT = {
  userName: "",
  password: "",
  confirm: "",
  email: "",
  firstName: "",
  lastName: ""
};

const USER_API = "http://localhost:8080/api/user";

function UpdateUserButton({ userId, user, updateParentInfo }) {
    const [userDetails, setUserDetails] = useState(USER_DETAILS_DEFAULT);
    const [errors, setErrors] = useState([]);

    const auth = AuthService.getAuth();
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const newUserDetails = {
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        setUserDetails(newUserDetails);
        setErrors([]);
    }, [user, showForm]);

    function handleChange(event) {
        const newUserDetails = {...userDetails};

        newUserDetails[event.target.name] = event.target.value;

        setUserDetails(newUserDetails);
    }

    function handleUpdateSubmit(event) {
        event.preventDefault();

        const sendUser = {...userDetails};

        sendUser.userId = userId;
        sendUser.password = user.password;
        sendUser.roles = null;

        const init = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + auth.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendUser)
        };

        console.log(init);

        fetch(`${USER_API}/update/${userId}`, init)
            .then(response => {
                if (response.status === 204) {
                    return null;
                } else if (response.status === 400) {
                    return response.json();
                } else {
                    return Promise.reject("Bad status code " + response.status);
                }
            })
            .then(data => {
                if (data == null) {
                    if (updateParentInfo) {
                        updateParentInfo(userDetails);
                    }
                    setShowForm(false);
                } else {
                    setErrors(data);
                }
            })
            .catch(console.log);
    }

    return (
        <>
        {(auth.id === parseInt(userId) || AuthService.isAdmin()) && (
            <div className="mb-4 w-100">
                {auth.id === parseInt(userId) && (
                    <button type="button" className="btn btn-warning" onClick={() => setShowForm(!showForm)}>Update Information</button>
                )}
                {showForm && (
                    <section className="d-flex flex-column gap-3 mt-4 border border-dark p-2 w-100">
                        <h3>Update Your Information</h3>
                        {errors.length > 0 && (
                            <div className="text-danger">
                                <p>The following errors were found with your updated information:</p>
                                <ul>
                                    {errors.map((err, i) => (
                                        <li key={`${err}-${i}`}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <form className="d-flex flex-column gap-3" onSubmit={handleUpdateSubmit}>
                            <fieldset>
                                <label className="form-label" htmlFor="userName">Username</label>
                                <input className="form-control" type="text" id="userName" name="userName" value={userDetails.userName} onChange={handleChange} />
                            </fieldset>
                            <fieldset>
                                <label className="form-label" htmlFor="email">Email</label>
                                <input className="form-control" type="email" id="email" name="email" value={userDetails.email} onChange={handleChange} />
                            </fieldset>
                            <fieldset>
                                <label className="form-label" htmlFor="firstName">First Name</label>
                                <input className="form-control" type="text" id="firstName" name="firstName" value={userDetails.firstName} onChange={handleChange} />
                            </fieldset>
                            <fieldset>
                                <label className="form-label" htmlFor="lastName">Last Name</label>
                                <input className="form-control" type="text" id="lastName" name="lastName" value={userDetails.lastName} onChange={handleChange} />
                            </fieldset>
                            <div className="d-flex flex-row gap-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </section>
                )}
            </div>  
        )}
        </>
    );
}

export default UpdateUserButton;
