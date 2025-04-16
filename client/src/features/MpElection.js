import mpDatas from "../Candidate_Datas/India_Proper_MP_Seats.json";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function MpElection() {
    const userOtp = localStorage.getItem("userOtp");
    const userVoterId = localStorage.getItem("userVoterId");
    const userEmail = localStorage.getItem("userEmail");

    const navigate = useNavigate();

    const initialErrors = { voterId: { required: false }, aadhar: { required: false }, otp: { required: false } };

    const [datas, setDatas] = useState(mpDatas);
    const [isClicked, setIsClicked] = useState(true);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [inputs, setInputs] = useState({ voterId: "", aadhar: "", otp: "" });
    const [errors, setErrors] = useState(initialErrors);
    const [isError, setIsError] = useState(true);

    const [margin,setMargin] = useState('60')

    const webcamRef = useRef(null);
    const [storedImage, setStoredImage] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [matchResult, setMatchResult] = useState("");

    const [showingSingleStateCandidates, setShowingSingleStateCandidates] = useState({});

    // Handle constituency selection
    function handleClick(state) {
        setIsClicked(false);
        setShowingSingleStateCandidates(state);
    }

    // Handle form input change
    function handleChange(e) {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    // Load face-api.js models and fetch stored image
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models"; // Path to models directory
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]);
            setIsModelLoaded(true);
        };

        loadModels();
        fetchStoredImage();
    }, []);

    // Fetch stored image for face comparison
    async function fetchStoredImage() {
        const response = await fetch(`http://localhost:5000/api/user/get-image/${userVoterId}`);
        const blob = await response.blob();
        const image = URL.createObjectURL(blob);
        setStoredImage(image);
    }

    // Handle face verification
    async function handleFaceVerification() {
        if (!storedImage || !webcamRef.current) {
            alert("Stored image or webcam feed not available.");
            return;
        }

        const webcamImage = webcamRef.current.getScreenshot();
        const storedImg = await faceapi.fetchImage(storedImage);
        const storedDetections = await faceapi
            .detectSingleFace(storedImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!storedDetections) {
            alert("No face detected in the stored image.");
            return;
        }

        const img = await faceapi.fetchImage(webcamImage);
        const webcamDetections = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!webcamDetections) {
            alert("No face detected in the webcam image.");
            return;
        }

        const distance = faceapi.euclideanDistance(
            storedDetections.descriptor,
            webcamDetections.descriptor
        );

        setMatchResult(distance < 0.6 ? "Matched" : "Not Matched");
    }

    // Handle form submit
    function handleSubmit(e) {
        e.preventDefault();

        let errors = { ...initialErrors };
        let hasError = false;

        if (inputs.voterId === "") {
            errors.voterId.required = true;
            hasError = true;
        }
        if (inputs.aadhar === "") {
            errors.aadhar.required = true;
            hasError = true;
        }
        if (inputs.otp === "") {
            errors.otp.required = true;
            hasError = true;
        }

        setIsError(hasError);
        setErrors(errors);

        if (!hasError) {
            axios.get(`http://localhost:5000/api/user/vote/mp/${userVoterId}`)
            .then((res) => {
                if (res.data.vote === 1) {
                    setIsFormSubmitted(true);
                    setMargin('100')
                }
            })
            .catch((err) => {
                alert(err.response.data);
                navigate('/dashboard');
            });
        }
    }

    function handleCountVote(candidate, constituency) {
        axios.post('http://localhost:5000/api/user/vote', {
            voterId: userVoterId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            alert(res.data.message);
            if(res.data.userVotedDetails.vote === 2){
                axios.post("http://localhost:5000/api/user/email",
                    {
                      email : userEmail,
                      vote : res.data.userVotedDetails.vote,
                      candidate,
                      constituency
                    },
                    {
                        headers : {
                            'Content-Type' : "application/json"
                        },
                    },
                  )
                    .then((res)=>{
                        console.log(res);
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            }
            console.log("mp : ",candidate,constituency)
            navigate('/dashboard')
        })
        .catch((err) => console.log(err));
    }

    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            background: "linear-gradient(135deg, #3b8d99, #6a5dfe)",
            width: "100vw",
            height: "100vh",
            boxSizing: "border-box",
            marginTop: `${margin}px`, // Ensure content does not overlap with navbar
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <h1 style={{
                fontSize: "2.5rem", 
                color: "white", 
                textAlign: "center", 
                marginBottom: "20px",
            }}>MP Election</h1>

            {/* Form section */}
            {!isFormSubmitted ? (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "auto",
                    border: "2px solid #007bff", // Adding border to differentiate the section
                    marginBottom: "40px", // Adding margin to space sections apart
                }}>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor='voterId' style={{ fontWeight: "bold", display: "block" }}>VoterId</label>
                            <input
                                type='text'
                                id='voterId'
                                name='voterId'
                                className='voterId'
                                placeholder='Enter Your VoterId..'
                                onChange={handleChange}
                                style={{
                                    width: "95%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    fontSize: "16px"
                                }}
                            />
                            {errors.voterId.required && <span style={{ color: "red" }}>Enter Your Voter Id</span>}
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor='aadhar' style={{ fontWeight: "bold", display: "block" }}>Aadhar</label>
                            <input
                                type='text'
                                id='aadhar'
                                name='aadhar'
                                className='aadhar'
                                placeholder='Enter Your Aadhar..'
                                onChange={handleChange}
                                style={{
                                    width: "95%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    fontSize: "16px"
                                }}
                            />
                            {errors.aadhar.required && <span style={{ color: "red" }}>Enter Your Aadhar</span>}
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor='otp' style={{ fontWeight: "bold", display: "block" }}>Otp</label>
                            <input
                                type='text'
                                id='otp'
                                name='otp'
                                className='otp'
                                placeholder='Enter Your Otp..'
                                onChange={handleChange}
                                style={{
                                    width: "95%",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    fontSize: "16px"
                                }}
                            />
                            {errors.otp.required && <span style={{ color: "red" }}>Enter Your Otp</span>}
                        </div>

                        {userOtp === inputs.otp && isModelLoaded && (
                            <div style={{ marginBottom: "15px", textAlign: "center" }}>
                                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="50%" />
                                <br />
                                <button
                                    type="button"
                                    onClick={handleFaceVerification}
                                    style={{
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                    }}
                                >
                                    Face Verification
                                </button>
                            </div>
                        )}

                        <div style={{ textAlign: "center" }}>
                            <button
                                type="submit"
                                style={{
                                    padding: "12px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </form>

                    {matchResult && <h3 style={{ textAlign: "center", marginTop: "20px" }}>Face Verification Result: {matchResult}</h3>}
                </div>
            ) : (
                <div style={{
                    fontFamily: "Arial, sans-serif",
                    padding: "20px",
                    background: "linear-gradient(135deg, #3b8d99, #6a5dfe)",
                    width: "100vw",
                    // height: "100vh",
                    boxSizing: "border-box",
                    overflow: "none",
                    // Ensure content does not overlap with navbar
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    {/* Showing the states and constituencies */}
                    {!isClicked ? (
                        <div style={{
                            maxWidth: "100%",
                            overflowX: "auto",
                            backgroundColor : "white",
                            marginTop: "20px",
                            border: "2px solid #007bff", // Border around the candidates table
                            borderRadius: "12px", // Rounded corners
                            padding: "10px"
                        }}>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            padding: "15px",
                                            textAlign: "center"
                                        }}>State Name</th>
                                        <th style={{
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            padding: "15px",
                                            textAlign: "center"
                                        }}>Constituency</th>
                                        <th style={{
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            padding: "15px",
                                            textAlign: "center"
                                        }}>Candidate Name</th>
                                        <th style={{
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            padding: "15px",
                                            textAlign: "center"
                                        }}>Party</th>
                                        <th style={{
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            padding: "15px",
                                            textAlign: "center"
                                        }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showingSingleStateCandidates.constituencies.map((constituency, index) => (
                                        <tr key={index} style={{
                                            padding: "10px 18px",
                                            backgroundColor: "#fff",
                                            borderBottom: "2px solid black",
                                            
                                        }}>
                                            <td style={{ padding: "12px", textAlign: "center" }}>{showingSingleStateCandidates.state_name}</td>
                                            <td style={{ padding: "12px", textAlign: "center",  }}>{constituency.name}</td>
                                            {constituency.candidates.map((candidate, ind) => (
                                                <tr key={ind}>
                                                    <td style={{ padding: "12px", textAlign: "center" }}>{candidate.name}</td>
                                                    <td style={{ padding: "12px", textAlign: "center" }}>{candidate.party}</td>
                                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                                        <button
                                                            onClick={() => handleCountVote(candidate, constituency)}
                                                            style={{
                                                                padding: "10px 18px",
                                                                backgroundColor: "#007bff",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius: "6px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Vote here
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "20px",
                            paddingTop: "20px",
                            
                        }}>
                            {datas.states.map((state, index) => (
                                <div
                                    onClick={() => handleClick(state)}
                                    key={index}
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        transition: "transform 0.3s ease",
                                        border: "2px solid #007bff", // Adding border to sections
                                        marginBottom: "20px",
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                                >
                                    <h3 style={{
                                        color: "#333",
                                        marginBottom: "10px"
                                    }}>State Name: {state.state_name}</h3>
                                    <p style={{ color: "#007bff" }}>MP Seats: {state.mp_seats}</p>
                                    <button
                                        style={{
                                            padding: "12px 20px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            marginTop: "10px"
                                        }}
                                    >
                                        View Candidates
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MpElection;
