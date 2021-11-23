import React, { Fragment, useState } from 'react'
import { Envelope, Key, Person } from 'react-bootstrap-icons';
import Layout from '../components/Layout'
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { userLogin } from '../store/user-slice';
import * as Yup from 'yup';
import { Formik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading'

const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Please Enter a name').trim(),
    email: Yup.string().required('Email is required').matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter correct email address"
    ),
    password: Yup.string().required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
        "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: Yup.string().required('Confirm password is required')
        .oneOf([Yup.ref("password"), null], "Passwords must match")

});
const formInitialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Register = () => {
    const router = useRouter()
    const { redirect } = router.query
    const userInfo = useSelector((state) => state.user.userInfo);
    if (userInfo) {
        router.push('/')
    }
    const dispatch = useDispatch()
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`

    return (
        <Layout title="Register">
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
            {userInfo ? <Loading /> :
                <Fragment>
                    <Container fluid className="my-auto d-flex flex-column" style={{ minHeight: `80vh` }}>
                        <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 d-flex justify-content-start align-content-start align-items-start`}>Register</h1>
                        <Row className="my-auto">
                            <Col className="col-10 d-flex flex-column mx-auto">
                                <Container className="w-50 justify-content-center">
                                    <Formik
                                        initialValues={formInitialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={async (values) => {
                                            toast.dismiss()
                                            const name = values.name.replace(/\s/g, '')
                                            const email = values.email
                                            const password = values.password
                                            const confirmPassword = values.confirmPassword
                                            if (password !== confirmPassword) {
                                                toast.error('Passwords do not match.')
                                                return
                                            }
                                            try {
                                                const { data } = await axios.post('/api/users/register', { name, email, password })
                                                dispatch(userLogin({ data }))
                                                router.push(redirect || '/')
                                            } catch (err) {
                                                toast.error(err.response.data ? err.response.data.message : err.message, {
                                                    duration: 5000,
                                                    position: 'top-center',
                                                    // icon: '👏',
                                                });
                                            }
                                        }}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => {
                                            return (
                                                <Form noValidate className={`${darkStyleText}`} onSubmit={handleSubmit}>
                                                    <Form.Group className="mb-2" controlId="name">
                                                        <Form.Label>Name</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon1"><Person className="text-warning fs-4" /></InputGroup.Text>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Enter name"
                                                                name="name"
                                                                value={values.name.trim()}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isValid={touched.name && !errors.name}
                                                                isInvalid={touched.name && errors.name}
                                                            />
                                                            <Form.Control.Feedback></Form.Control.Feedback>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.name}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group className="mb-2" controlId="email">
                                                        <Form.Label>Email address</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon2"><Envelope className="text-warning fs-4" /></InputGroup.Text>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Enter email"
                                                                name="email"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isValid={touched.email && !errors.email}
                                                                isInvalid={touched.email && errors.email}
                                                            />
                                                            <Form.Control.Feedback></Form.Control.Feedback>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.email}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group className="mb-2" controlId="password">
                                                        <Form.Label>Password</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon3"><Key className="text-warning fs-4" /></InputGroup.Text>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Password"
                                                                name="password"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isValid={touched.password && !errors.password}
                                                                isInvalid={touched.password && errors.password}
                                                            />
                                                            <Form.Control.Feedback></Form.Control.Feedback>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.password}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                                        <Form.Label>Confirm Password</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon4"><Key className="text-warning fs-4" /></InputGroup.Text>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Confirm Password"
                                                                name="confirmPassword"
                                                                value={values.confirmPassword}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isValid={touched.confirmPassword && !errors.confirmPassword}
                                                                isInvalid={touched.confirmPassword && errors.confirmPassword}
                                                            />
                                                            <Form.Control.Feedback></Form.Control.Feedback>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.confirmPassword}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Button variant="warning" type="submit" className="w-100 mb-3">
                                                        Register
                                            </Button>
                                                    <p className={`${darkStyleText}`}>Already have an account?
                                                <Link href={`/login?redirect=${redirect || '/'}`} passHref>
                                                            <a className="text-warning text-decoration-none ms-3">Login</a>
                                                        </Link>
                                                    </p>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </Fragment>}
        </Layout >
    )
}
export default Register
