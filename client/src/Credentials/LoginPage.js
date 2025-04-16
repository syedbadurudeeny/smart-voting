import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Loginpage() {

  function uniqueId(){
    let numArr = ['0','1','2','3','4','5','6','7','8','9'];
    let randomNum = "";

    for(let i=0;i<6;i++){
      let checkNewOtp = numArr[Math.floor(Math.random() * numArr.length)]
      randomNum+=checkNewOtp
    }
    return randomNum;
  }

  const initialErrors = {
    voterId: { required: false },
    aadhar: { required: false },
    otp: { required: false },
  };
  const initialInputs = { voterId: "", aadhar: "", otp: ""};

  const [userInputs, setUserInputs] = useState(initialInputs);
  const [userErrors, setUserErrors] = useState(initialErrors);

  const [newOpt,setNewOpt] = useState("");

  const navigation = useNavigate();

  const [disable, setDisable] = useState(true);

  function handleChange(e) {
    setUserInputs({ ...userInputs, [e.target.name]: e.target.value });
  }

  function handleOtp(){
    axios.post("http://localhost:5000/api/user/email",
      {
        voterId : userInputs.voterId,
        otp : uniqueId()
      },
      {
          headers : {
              'Content-Type' : "application/json"
          },
      },
    )
      .then((res)=>{
          if(res){
            localStorage.setItem("userEmail",res.data.user.email)
            setNewOpt(JSON.parse(res.config.data).otp)
            // localStorage.setItem("");
            localStorage.setItem("userOtp",JSON.parse(res.config.data).otp)
          }
      })
      .catch((err)=>{
          console.log(err);
      })
      }

  function handleSubmit(e) {
    e.preventDefault();

    let errors = initialErrors;
    let inputError = false;

    Object.entries(errors).forEach(([name, value]) => {
      if (userInputs[name] === "") {
        errors[name].required = true;
        inputError = true;
      }
    });

    setDisable(inputError);
    setUserErrors({ ...errors });

    if (!inputError) {

      if(newOpt !== userInputs.otp){
        alert('Otp mis-matched');
        return
      }

        axios.post("http://localhost:5000/api/user/login",
            {
              voterId: userInputs.voterId,
              aadhar: userInputs.aadhar,
              otp: userInputs.otp,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            alert("Login Successfull");
            localStorage.setItem("userToken", res.data.accessToken);
            localStorage.setItem("userVoterId", res.data.voterId);
            setUserInputs({ voterId : "", aadhar: "", otp: ""});
            navigation("/dashboard");
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      }
    }

  return (
    <>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3>Login Page</h3>

            <div style={styles.formGroup}>
              <label htmlFor="voterId" style={styles.label}>Voter ID</label>
              <input
                type="text"
                name="voterId"
                id="voterId"
                value={userInputs.voterId}
                placeholder="Enter Your Voter ID..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.voterId.required ? <span style={styles.errorText}>Voter ID is required</span> : null}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="aadhar" style={styles.label}>Aadhar</label>
              <input
                type="text"
                name="aadhar"
                id="aadhar"
                value={userInputs.aadhar}
                placeholder="Enter Your Aadhar..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.aadhar.required ? <span style={styles.errorText}>Aadhar is required</span> : null}
            </div>

            <button onClick={handleOtp} style={styles.button}>Get OTP</button>
            <br/>
            <div style={styles.formGroup}>
              <label htmlFor="otp" style={styles.label}>OTP</label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={userInputs.otp}
                placeholder="Enter Your OTP..."
                onChange={handleChange}
                style={styles.input}
              />
              {userErrors.otp.required ? <span style={styles.errorText}>OTP is required</span> : null}
            </div>

            <button type="submit" disabled={!disable} style={disable ? { ...styles.button, ...styles.buttonDisabled } : styles.button}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

// Styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh", // Full height of the screen
    fontFamily: "'Arial', sans-serif",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
    width: "40%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  formGroup: {
    marginBottom: "20px",
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "20%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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

export default Loginpage;
