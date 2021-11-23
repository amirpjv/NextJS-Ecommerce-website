import React, { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'
import { Container, Navbar, Nav, Badge, Modal, Spinner, Button, InputGroup, NavDropdown, FormControl } from 'react-bootstrap'
import Link from 'next/link'
import Toggle from 'react-toggle'
import { SunFill, MoonStarsFill, Search } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getMode, darkModeToggle } from '../store/darkMode-slice';
import { getCartItems, removeCartItems } from '../store/cart-slice';
import { getUser, userLogout } from '../store/user-slice';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';

// const Layout = ({ title, description, children }) => {
function Layout({ title, description, children }) {
    const [searchBar, setSearchBar] = useState(false)
    const [show, setShow] = useState(false);
    const router = useRouter()
    const userInfo = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.darkMode.darkMode)
    const load = useSelector((state) => state.darkMode.loading);
    const cart = useSelector((state) => state.cart.cartItems);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const darkStyleBackground = `${darkMode ? 'bg-dark' : 'bg-light'}`
    useEffect(() => {
        dispatch(getUser())
        dispatch(getMode())
        dispatch(getCartItems())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const logoutClickHandler = () => {
        dispatch(removeCartItems())
        dispatch(userLogout())
        setShow(false)
        router.push('/login')
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [query, setQuery] = useState('')
    const submitHandler = (e) => {
        e.preventDefault()
        router.push(`/search?query=${query}`)
    }

    return (
        <Fragment>
            <Head>
                <title>{title ? `${title}` : 'Amazona'}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <Navbar className="bg-secondary overflow-visible" collapseOnSelect expand="md">
                <Container>
                    <Navbar.Brand href="/" id="nav-brand"><span className={`${darkStyleText}`}>Amazona</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                        {router.pathname === '/' ? <Container className="d-flex justify-content-between">
                            <InputGroup className="w-50 bg-white mx-auto rounded rounded-3" size={'sm'}>
                                <FormControl
                                    name="query"
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search..."
                                    aria-label="Search..."
                                    aria-describedby="basic-addon2"
                                    onKeyUp={submitHandler}
                                />
                                <Button variant="warning text-center" id="button-addon2" onClick={submitHandler}>
                                    <Search className="text-dark h5 w-100" id="search" />
                                </Button>
                            </InputGroup>
                        </Container> : <Fragment></Fragment>}
                        <Nav className="d-flex justify-content-center align-content-center align-items-center">
                            {/* <Nav justify variant="pills" defaultActiveKey="/home"> */}
                            <Link href="/" passHref>
                                <Nav.Link eventKey="2" className={`${darkStyleText} w-50`} id="nav-link">Home</Nav.Link>
                            </Link>
                            <Link href="/cart" passHref>
                                <Nav.Link eventKey="2" className={`${darkStyleText} w-50`} id="nav-link">
                                    Cart{cart.length > 0 ? (<Badge className="bg-success">{cart.length}</Badge>) : ('')}
                                </Nav.Link>
                            </Link>
                            {
                                userInfo
                                    ?
                                    <NavDropdown id="nav-dropdown" title={userInfo.name} menuVariant={darkMode ? "dark" : "light"} className="d-flex">
                                        <NavDropdown.Item onClick={() => router.push("/profile")}>Profile</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => router.push("/order-history")}>Order History</NavDropdown.Item>
                                        {userInfo.isAdmin && <NavDropdown.Item onClick={() => router.push("/admin/dashboard")}>Admin Dashboard</NavDropdown.Item>}
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleShow}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                    :
                                    <Link href="/login" passHref>
                                        <Nav.Link eventKey="2" className={`${darkStyleText} w-50`} id="nav-link">Login</Nav.Link>
                                    </Link>
                            }
                            <Toggle icons={{
                                checked: <MoonStarsFill className="text-warning h5" id="moon-toggle" />,
                                unchecked: <SunFill className="text-warning h5" id="sun-toggle" />
                            }} className="custom-classname justify-content-center mx-3 mt-md-2 mt-sm-2"
                                checked={darkMode}
                                onChange={() => dispatch(darkModeToggle())} />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {load && <Modal className="d-flex justify-content-center"
                dialogClassName="modal-100w modal-100h">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Please confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to leave?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={logoutClickHandler}>
                        Yes
                    </Button>
                    <Button variant="success" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container fluid style={{ minHeight: `80vh` }} className={`${darkStyleBackground}`} id="main-content">
                {children}
            </Container>
            {/* <footer className="text-white bg-secondary container-fluid position-fixed bottom-0 align-items-center d-flex justify-content-center" style={{height:`10vh`}}>
                &copy; {new Date().getFullYear()} Copyright: Amir
            </footer> */}
            <footer className={`${darkStyleText} position-absolute overflow-hidden bg-secondary container-fluid text-center mb-0 ms-0 align-items-center d-flex justify-content-center`} id="footer">
                &copy; {new Date().getFullYear()} Copyright: Amir
            </footer>
        </Fragment >
    )
}

// export default Layout

export default dynamic(() => Promise.resolve(Layout), { ssr: false });