/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import axios from "axios";

function Registerpage() {
  const initialErrors = {
    name: { required: false },
    age: { required: false },
    gender: { required: false },
    dob: { required: false },
    address: { required: false },
    email: { required: false },
    phNum: { required: false },
    voterId: { required: false },
    aadhar: { required: false },
    photo: { required: false },
  };

  const initialInputs = {
    name: "",
    age: "",
    gender: "",
    dob: "",
    address: "",
    email: "",
    phNum: "",
    voterId: "",
    aadhar: "",
    photo: null, // Photo is initially null
  };

  const [userInputs, setUserInputs] = useState(initialInputs);
  const [userErrors, setUserErrors] = useState(initialErrors);
  const [disable, setDisable] = useState(true);
  const [image, setImage] = useState(null); // Set the image state to null initially

  function handleChange(e) {
    if (e.target.name === "photo") {
      setImage(e.target.files[0].name); // Store the selected image file
      setUserInputs({ ...userInputs, photo: e.target.files[0] }); // Store the photo in userInputs
    } else {
      setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = initialErrors;
    let inputError = false;

    // Check if all required fields are filled
    Object.entries(errors).forEach(([name, value]) => {
      if (userInputs[name] === "" && (name !== "photo" || !image)) { // Check if photo is selected
        errors[name].required = true;
        inputError = true;
      }
    });

    setDisable(inputError);
    setUserErrors({ ...errors });

    // If no errors, submit the form
    if (!inputError) {

      axios
        .post("http://localhost:5000/api/user/register", {
          name : userInputs.name,
          age : userInputs.age,
          gender : userInputs.gender,
          dob : userInputs.dob,
          address : userInputs.address,
          email : userInputs.email,
          phNum : userInputs.phNum,
          voterId : userInputs.voterId,
          aadhar : userInputs.aadhar,
          vote : 0,
          photo : image ? image : null
        }, {
          headers: {
            'Content-Type': 'application/json', // Important header for file uploads
          },
        })
        .then((res) => {
          if (res.data) {
            alert("Registration Successful");
          }
        })
        .catch((error) => {
          alert(error.response?.data || "Something went wrong");
          console.log(error);
        });

      // Reset the form fields after successful submission
      setUserInputs({
        name: "",
        age: "",
        gender: "",
        dob: "",
        address: "",
        email: "",
        phNum: "",
        voterId: "",
        aadhar: "",
        photo: null,
      });
      setImage(null); // Reset the image
    }
  }

  // Internal Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100vw",
      height: "100vh", // Full height of the screen
      fontFamily: "'Arial', sans-serif",
    },
    formWrapper: {
      width: "70%",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "40px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formTitle: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "30px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
    },
    formGroup: {
      width: "48%", // Each box will take 48% of the row width
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "6px",
    },
    input: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
      marginBottom: "10px",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#007bff",
      color: "#fff",
      fontSize: "16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginTop: "20px",
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
    errorText: {
      color: "red",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h3 style={styles.formTitle}>Register Page</h3>
        <form onSubmit={handleSubmit}>
          {/* Row 1 - Left and Right Aligned Inputs */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={userInputs.name}
                placeholder="Enter Your Name..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.name?.required && (
                <span style={styles.errorText}>Name is required</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="age" style={styles.label}>
                Age
              </label>
              <input
                type="text"
                name="age"
                id="age"
                value={userInputs.age}
                placeholder="Enter Your Age..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.age?.required && (
                <span style={styles.errorText}>Age is required</span>
              )}
            </div>
          </div>

          {/* Row 2 - Left and Right Aligned Inputs */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="gender" style={styles.label}>
                Gender
              </label>
              <input
                type="text"
                name="gender"
                id="gender"
                value={userInputs.gender}
                placeholder="Enter Your Gender..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.gender?.required && (
                <span style={styles.errorText}>Gender is required</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="dob" style={styles.label}>
                Date of Birth
              </label>
              <input
                type="text"
                name="dob"
                id="dob"
                value={userInputs.dob}
                placeholder="Enter Your Date of Birth..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.dob?.required && (
                <span style={styles.errorText}>Date of Birth is required</span>
              )}
            </div>
          </div>

          {/* Row 3 - Left and Right Aligned Inputs */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="address" style={styles.label}>
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={userInputs.address}
                placeholder="Enter Your Address..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.address?.required && (
                <span style={styles.errorText}>Address is required</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userInputs.email}
                placeholder="Enter Your Email..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.email?.required && (
                <span style={styles.errorText}>Email is required</span>
              )}
            </div>
          </div>

          {/* Row 4 - Left and Right Aligned Inputs */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="phNum" style={styles.label}>
                Phone Number
              </label>
              <input
                type="text"
                name="phNum"
                id="phNum"
                value={userInputs.phNum}
                placeholder="Enter Your Phone Number..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.phNum?.required && (
                <span style={styles.errorText}>Phone Number is required</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="voterId" style={styles.label}>
                Voter ID
              </label>
              <input
                type="text"
                name="voterId"
                id="voterId"
                value={userInputs.voterId}
                placeholder="Enter Your Voter ID..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.voterId?.required && (
                <span style={styles.errorText}>Voter ID is required</span>
              )}
            </div>
          </div>

          {/* Row 5 - Left and Right Aligned Inputs */}
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label htmlFor="aadhar" style={styles.label}>
                Aadhar
              </label>
              <input
                type="text"
                name="aadhar"
                id="aadhar"
                value={userInputs.aadhar}
                placeholder="Enter Your Aadhar Number..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.aadhar?.required && (
                <span style={styles.errorText}>Aadhar is required</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="photo" style={styles.label}>
                Photo
              </label>
              <input
                type="file"
                name="photo"
                id="photo"
                onChange={handleChange}
                style={styles.input}
              />
              {image && <img src={image} alt="Uploaded" width="100px" height="100px" />}
              {userErrors.photo?.required && (
                <span style={styles.errorText}>Photo is required</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            // style={disable ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            // disabled={!disable}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registerpage;
