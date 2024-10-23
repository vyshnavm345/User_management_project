import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "features/user";
import logo from './rainbow-logo-design.png';

const Navbar = ()=>{
    const dispatch = useDispatch();
    const {isAuthenticated, user} =useSelector(state => state.user);

    const authLinks = (
        <>
        <li className="nav-item">
            <NavLink className="nav-link" to="/dashboard">
                Dashboard
            </NavLink>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="#!" onClick={() => dispatch(logout())}>Logout</a>
        </li>
        </>
    )

    const guestLinks = (
        <>
        <li className="nav-item">
            <NavLink className="nav-link" to="/login">
                Login
            </NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/register">
                Register
            </NavLink>
        </li>
        </>
    )

    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link className="navbar-brand" to='/'>
            <img style={{height:"65px"}} src={logo} alt="logo" />
            </Link>
            &nbsp;&nbsp;
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                        Home
                    </NavLink>
                </li>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>
            </div>
            {user && (
            <div  style={{marginRight: "200px"}}>
                <h5>{`Hello, ${user.first_name}`}</h5>
            </div>
            )}
        </div>
    </nav>
)
}

export default Navbar








// import { Link, NavLink } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// // import { logout } from 'features/user';

// const Navbar = () => {
// 	const dispatch = useDispatch();
// 	const { isAuthenticated } = useSelector(state => state.user);

// 	const authLinks = (
// 		<>
// 			<li className='nav-item'>
// 				<NavLink className='nav-link' to='/dashboard'>
// 					Dashboard
// 				</NavLink>
// 			</li>
// 			<li className='nav-item'>
// 				<a className='nav-link' href='#!' onClick={() => dispatch(logout())}>
// 					Logout
// 				</a>
// 			</li>
// 		</>
// 	);

// 	const guestLinks = (
// 		<>
// 			<li className='nav-item'>
// 				<NavLink className='nav-link' to='/login'>
// 					Login
// 				</NavLink>
// 			</li>
// 			<li className='nav-item'>
// 				<NavLink className='nav-link' to='/register'>
// 					Register
// 				</NavLink>
// 			</li>
// 		</>
// 	);

// 	return (
// 		<nav className='navbar navbar-expand-lg bg-light'>
// 			<div className='container-fluid'>
// 				<Link className='navbar-brand' to='/'>
// 					Auth Site
// 				</Link>
// 				<button
// 					className='navbar-toggler'
// 					type='button'
// 					data-bs-toggle='collapse'
// 					data-bs-target='#navbarNav'
// 					aria-controls='navbarNav'
// 					aria-expanded='false'
// 					aria-label='Toggle navigation'
// 				>
// 					<span className='navbar-toggler-icon'></span>
// 				</button>
// 				<div className='collapse navbar-collapse' id='navbarNav'>
// 					<ul className='navbar-nav'>
// 						<li className='nav-item'>
// 							<NavLink className='nav-link' to='/'>
// 								Home
// 							</NavLink>
// 						</li>
// 						{isAuthenticated ? authLinks : guestLinks}
// 					</ul>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };

// export default Navbar;
