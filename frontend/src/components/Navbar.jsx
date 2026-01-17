import { Link, useNavigate } from "react-router-dom"
import { ACCESS_TOKEN } from "../constants"
import styles from "../styles/Navbar.module.css"

export default function Navbar() {
    const navigate = useNavigate()
    const isLoggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN))

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <div className={styles.navbarLogo}>
                    <Link to="/">GeoWorks</Link>
                </div>
                <ul className={styles.navMenu}>
                    <li className={styles.navItem}>
                        <Link to="/" className={styles.navLink}>Home</Link>
                    </li>
                    {isLoggedIn ? (
                        <>
                            {/* W.I.P */}
                            <li className={styles.navItem}>
                                <Link to="/menu" className={styles.navLink}>Dashboard</Link> 
                            </li>
                            
                            <li className={styles.navItem}>
                                <Link to="/map" className={styles.navLink}>Map</Link>
                            </li>
                            <li className={styles.navItem}>
                                <button onClick={handleLogout} className={styles.navLinkBtn}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles.navItem}>
                                <Link to="/login" className={styles.navLink}>Login</Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/register" className={`${styles.navLink} ${styles.registerBtn}`}>
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}