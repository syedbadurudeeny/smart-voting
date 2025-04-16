import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const userToken = localStorage.getItem("userToken");
  const navigate = useNavigate();

  function Logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userOtp");
    localStorage.removeItem("userVoterId");
    navigate("/");
  }

  return (
    <>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            {!userToken ? (
              <li style={styles.navItem}>
                <Link to={"/"} style={styles.navLink}>
                  Register
                </Link>
              </li>
            ) : null}
            {!userToken ? (
              <li style={styles.navItem}>
                <Link to={"/login"} style={styles.navLink}>
                  Login
                </Link>
              </li>
            ) : null}
            {userToken ? (
              <li style={styles.navItem}>
                <Link to={"/dashboard"} style={styles.navLink}>
                  Dashboard
                </Link>
              </li>
            ) : null}
            {userToken ? (
              <li style={styles.navItem}>
                <Link to={"/mla/election"} style={styles.navLink}>
                  Mla
                </Link>
              </li>
            ) : null}
            {userToken ? (
              <li style={styles.navItem}>
                <Link to={"/mp/election"} style={styles.navLink}>
                  Mp
                </Link>
              </li>
            ) : null}
            {userToken ? (
              <li style={styles.navItem}>
                <Link to={"/future/election"} style={styles.navLink}>
                  Future Elections
                </Link>
              </li>
            ) : null}
            {userToken ? (
              <li style={styles.navItem}>
                <Link to={"/"} style={styles.navLink} onClick={Logout}>
                  Logout
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
    </>
  );
}

const styles = {
  header: {
    backgroundColor: "#4CAF50",
    padding: "10px 0",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  nav: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "8px 15px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  navLinkHover: {
    backgroundColor: "#45a049",
  },
  main: {
    padding: "20px",
    maxWidth: "100%",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(100vh - 100px)", // Adjust to ensure no scrolling
  },
};

export default Layout;
