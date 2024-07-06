import { NavLink } from 'react-router-dom'; //navigation
import styles from './Navbar.module.css';
import { useSelector } from 'react-redux'; //to state read
import { signout } from '../../api/internal';
import { resetUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';

function Navbar() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.user.auth); //for login authenticate data

  const handleSignout = async () => {
    await signout();
    dispatch(resetUser());
  };

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to='/' className={`${styles.logo} ${styles.inActiveStyle}`}>
          CoinBiance
        </NavLink>

        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          } //true and false
        >
          Home
        </NavLink>

        <NavLink
          to='crypto'
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Cryptocurrencies
        </NavLink>

        <NavLink
          to='blogs'
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Blogs
        </NavLink>

        <NavLink
          to='submit'
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Submit a blog
        </NavLink>

        {isAuthenticated ? (
          <div>
            <NavLink>
              <button className={styles.signOutButton} onClick={handleSignout}>
                Sign Out
              </button>
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink
              to='login'
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.logInButton}>Log In</button>
            </NavLink>

            <NavLink
              to='signup'
              className={({ isActive }) =>
                isActive ? styles.activeStyle : styles.inActiveStyle
              }
            >
              <button className={styles.signUpButton}>Sign up</button>
            </NavLink>
          </div>
        )}
      </nav>
      <div className={styles.separator}></div>
    </>
  );
}

export default Navbar;
