import mlaDatas from '../Candidate_Datas/Updated_TamilNadu_Constituencies.json';
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function MlaElection() {

    const userOtp = localStorage.getItem("userOtp");
    const userVoterId = localStorage.getItem("userVoterId");
    const userEmail = localStorage.getItem("userEmail");

    const navigate = useNavigate();

    const initialErrors = { voterId: { required: false }, aadhar: { required: false }, otp: { required: false } }

    const [datas, setDatas] = useState(mlaDatas);
    const [isClicked, setIsClicked] = useState(true);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [inputs, setInputs] = useState({ voterId: "", aadhar: "", otp: "" });
    const [errors, setErrors] = useState(initialErrors);
    const [isError, setIsError] = useState(true);

    const webcamRef = useRef(null);
    const [storedImage, setStoredImage] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [matchResult, setMatchResult] = useState("");
    const [showingSingleConstituentCandidates, setShowingSingleConstituentCandidates] = useState({});

    // Handle constituency selection
    function handleClick(constituent) {
        setIsClicked(false);
        setShowingSingleConstituentCandidates(constituent);
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
            console.log("Models loaded successfully!");
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
        const storedDetections = await faceapi.detectSingleFace(storedImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!storedDetections) {
            alert("No face detected in the stored image.");
            return;
        }

        const img = await faceapi.fetchImage(webcamImage);
        const webcamDetections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!webcamDetections) {
            alert("No face detected in the webcam image.");
            return;
        }

        const distance = faceapi.euclideanDistance(storedDetections.descriptor, webcamDetections.descriptor);
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
            axios.get(`http://localhost:5000/api/user/vote/mla/${userVoterId}`)
                .then((res) => {
                    if (res.data.vote === 0) {
                        setIsFormSubmitted(true);
                    }
                })
                .catch((err) => {
                    if (err.response.data) {
                        alert(err.response.data);
                        navigate('/dashboard');
                    }
                });
        }
    }

    // Handle voting action
    function handleCountVote(candidate, constituency) {
        axios.post('http://localhost:5000/api/user/vote', {
            voterId: userVoterId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            alert(res.data.message);
            if(res.data.userVotedDetails.vote === 1){
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
            navigate('/dashboard')
        })
            .catch((err) => console.log(err));

        console.log("Candidate: ", candidate);
        console.log("Constituency: ", constituency);
    }

    return (
        <div style={styles.container}>            
            <h1 style={styles.heading}>Mla Election</h1>
            { !isFormSubmitted ? (
                <section style={styles.formContainer}>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputContainer}>
                            <label htmlFor='voterId' style={styles.label}>VoterId</label>
                            <input 
                                type='text' 
                                id='voterId' 
                                name='voterId' 
                                placeholder='Enter Your VoterId..' 
                                onChange={handleChange} 
                                style={styles.input}
                            />
                            {errors.voterId.required && <span style={styles.errorText}>Enter Your Voter Id</span>}
                        </div>

                        <div style={styles.inputContainer}>
                            <label htmlFor='aadhar' style={styles.label}>Aadhar</label>
                            <input 
                                type='text' 
                                id='aadhar' 
                                name='aadhar' 
                                placeholder='Enter Your Aadhar..' 
                                onChange={handleChange} 
                                style={styles.input}
                            />
                            {errors.aadhar.required && <span style={styles.errorText}>Enter Your Aadhar</span>}
                        </div>

                        <div style={styles.inputContainer}>
                            <label htmlFor='otp' style={styles.label}>Otp</label>
                            <input 
                                type='text' 
                                id='otp' 
                                name='otp' 
                                placeholder='Enter Your Otp..' 
                                onChange={handleChange} 
                                style={styles.input}
                            />
                            {errors.otp.required && <span style={styles.errorText}>Enter Your Otp</span>}
                        </div>

                        {userOtp === inputs.otp && isModelLoaded && (
                            <div style={styles.faceVerificationContainer}>
                                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="30%" />
                                <br/>
                                <button type="button" onClick={handleFaceVerification} style={styles.faceVerificationButton}>Face Verification</button>
                            </div>
                        )}

                        <button type="submit" style={styles.submitButton}>Submit</button>
                    </form>
                    {matchResult && <h3>{matchResult}</h3>}
                </section>
            ) : (
                <section style={styles.voteSection}>
                    {!isClicked ? (
                        <div style={styles.scrollableTable}>
                            <table style={styles.candidateTable}>
                                <thead style={styles.candidateTableHead}>
                                    <tr>
                                        <th style={styles.tableHead}>Name</th>
                                        <th style={styles.tableHead}>District</th>
                                        <th style={styles.tableHead}>Candidates Name</th>
                                        <th style={styles.tableHead}>Party</th>
                                        <th style={styles.tableHead}>Action</th>
                                    </tr>
                                </thead>
                                <tbody style={styles.candidateTableBody}>
                                    {showingSingleConstituentCandidates.candidates.map((candidate, index) => (
                                        <tr key={index}>
                                            <td style={styles.tableCell}>{showingSingleConstituentCandidates.name}</td>
                                            <td style={styles.tableCell}>{showingSingleConstituentCandidates.district}</td>
                                            <td style={styles.tableCell}>{candidate.name}</td>
                                            <td style={styles.tableCell}>{candidate.party}</td>
                                            <td style={styles.tableCell}>
                                                <button onClick={() => handleCountVote(candidate, showingSingleConstituentCandidates)} style={styles.voteButton}>Vote here</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={styles.constituencyListContainer}>
                            <ul style={styles.constituencyList}>
                                {datas.constituencies.map((constituency, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => handleClick(constituency)} 
                                        style={styles.constituencyItem}
                                    >
                                        <h3 style={styles.constituencyItemTitle}>{constituency.name}</h3>
                                        <p>{constituency.district}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: "linear-gradient(135deg, #3b8d99, #6a5dfe)",
        width: '100%',
        height: '100vh',
        fontFamily: 'Roboto, sans-serif',
        color: '#fff',
        textAlign: 'center',
        padding: '20px',
        overflowY: 'auto',
    },
    heading: {
        fontSize: '3rem',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '40px',
    },
    formContainer: {
        maxWidth: '700px',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        outline: 'none',
        transition: 'border-color 0.3s ease',
        backgroundColor: '#f5f5f5',
        color: '#333',
    },
    inputFocus: {
        borderColor: '#4caf50',
    },
    errorText: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px',
    },
    faceVerificationContainer: {
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    faceVerificationButton: {
        backgroundColor: '#ff3e00',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontSize: '16px',
    },
    submitButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        padding: '14px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        fontSize: '16px',
    },
    voteSection: {
        marginTop: '40px',
        width: '100%',
    },
    candidateTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    candidateTableHead: {
        backgroundColor: '#007bff',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    candidateTableBody: {
        fontSize: '14px',
        color: '#333',
    },
    tableHead: {
        padding: '12px',
        textAlign: 'center',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
        color: '#333',
    },
    voteButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    constituencyListContainer: {
        maxHeight: '400px',
        overflowY: 'auto',  // Allow scrolling for long lists
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    },
    constituencyList: {
        listStyleType: 'none',
        padding: 0,
        textAlign: 'left',
    },
    constituencyItem: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    },
    constituencyItemTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
    },
    scrollableTable: {
        overflowX: 'auto',
        marginTop: '20px',
    },
};

export default MlaElection;
