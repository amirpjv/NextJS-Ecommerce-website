import React, { Fragment, useState } from 'react'
import { Envelope, Key } from 'react-bootstrap-icons';
import Layout from '../components/Layout'
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { userLogin } from '../store/user-slice';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading'

const Login = () => {
    const router = useRouter()
    const { redirect } = router.query
    const userInfo = useSelector((state) => state.user.userInfo);
    if (userInfo) {
        router.push('/')
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        try {
            const { data } = await axios.post('/api/users/login', { email, password })
            dispatch(userLogin({ data }))
            router.push(redirect || '/')
        } catch (err) {
            toast.error(err.response.data ? err.response.data.message : err.message, {
                duration: 5000,
                position: 'top-center',
                // icon: '👏',
            });
        }
    }
    return (
        <Layout title="Login">
            <Toaster
                toastOptions={{
                    success: {
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            {userInfo ? <Loading/> :
                <Fragment>
                    <Container fluid className="my-auto d-flex flex-column" style={{ minHeight: `80vh` }}>
                        <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 d-flex justify-content-start align-content-start align-items-start`}>Login</h1>
                        <Row className="my-auto mt-5">
                            <Col className="col-10 d-flex flex-column mx-auto">
                                <Container className="w-50 justify-content-center">
                                    <Form className={`${darkStyleText}`} onSubmit={submitHandler}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <InputGroup className="">
                                                <InputGroup.Text id="basic-addon1"><Envelope className="text-warning fs-4" /></InputGroup.Text>
                                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-4" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup className="">
                                                <InputGroup.Text id="basic-addon2"><Key className="text-warning fs-4" /></InputGroup.Text>
                                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                            </InputGroup>
                                        </Form.Group>
                                        <Button variant="warning" type="submit" className="w-100 mb-3">
                                            Login
                                </Button>
                                        <p className={`${darkStyleText}`}>Don{`'`}t have an account?
                                <Link href={`/register?redirect=${redirect || '/'}`} passHref>
                                                <a className="text-warning text-decoration-none ms-3">Register</a>
                                            </Link>
                                        </p>
                                    </Form>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </Fragment>}
        </Layout >
    )
}
export default Login
