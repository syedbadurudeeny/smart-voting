import React from "react";

function FutureElection() {
  const mla = ["2026", "2031", "2036", "2041", "2046", "2051"];
  const mp = ["2029", "2034", "2039", "2044", "2049", "2054"];

  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          // padding: "0 20px",
          width : "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor : "white",

        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "#333",
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Future Elections
        </h1>

        <section
          style={{
            backgroundColor: "red",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "#007bff",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            MLA Future Elections (Up To 2050)
          </h2>
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              margin: "0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {mla.map((year, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
                }}
              >
                <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "10px" }}>
                  TN State Elections
                </h3>
                <h4 style={{ fontSize: "1.25rem", color: "#555" }}>Year: {year}</h4>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            backgroundColor: "red",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              color: "#007bff",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            MP Future Elections (Up To 2050)
          </h2>
          <ul
            style={{
              listStyleType: "none",
              padding: "0",
              margin: "0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {mp.map((year, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
                }}
              >
                <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "10px" }}>
                  IND State Elections
                </h3>
                <h4 style={{ fontSize: "1.25rem", color: "#555" }}>Year: {year}</h4>
              </li>
            ))}
          </ul>
        </section>
      </div>
      
    </>
  );
}

export default FutureElection;
