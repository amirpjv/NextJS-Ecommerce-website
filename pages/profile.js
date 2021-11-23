import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav, Form, InputGroup } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../utils/error';
import Link from 'next/link'
import Layout from '../components/Layout';
import Loading from '../components/Loading'
import { getOrderHistory } from '../store/order-slice';
import toast, { Toaster } from 'react-hot-toast';
import { userLogin } from '../store/user-slice';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Envelope, Key, Person } from 'react-bootstrap-icons';

const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Please Enter a name').trim(),
    email: Yup.string().required('Email is required').matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter correct email address"
    ),
    password: Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
            "Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
});
const formInitialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

function Profile() {
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
    const orderHistory = useSelector((state) => state.order.orderHistory);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const dispatch = useDispatch()
    const isActive = (r) => {
        if (r === router.pathname) {
            return "text-info fs-5 active"
        } else {
            return ""
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (!userInfo) {
            return router.push('/login');
        }
    }, []);

    return (
        <Layout title="Profile">
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
            <Container fluid>
                <Row className="d-flex justify-content-center py-3">
                    <Col className="col-2">
                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                            <Nav className="d-flex flex-column justify-content-start fs-6">
                                <Nav.Item className="ms-2"><Link href="/profile" passHref><Nav.Link className={isActive("/profile")}>User Profile</Nav.Link></Link></Nav.Item>
                                <Nav.Item className="ms-2"><Link href="/order-history" passHref><Nav.Link className={isActive("/order-history")}>Order History</Nav.Link></Link></Nav.Item>
                            </Nav>
                        </Card>
                    </Col>
                    <Col className="col-10 d-flex flex-column mx-auto">
                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                            <Card.Body className="d-flex flex-column align-items-start">
                                <Card.Title className={`${darkStyleText} pt-2 ps-3 pb-2`}>Profile</Card.Title>
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
                                                const { data } = await axios.put('/api/users/profile',
                                                    { name, email, password },
                                                    { headers: { authorization: `Bearer ${userInfo.token}` } })
                                                dispatch(userLogin({ data }))
                                                toast.success('Changes have been done.')
                                            } catch (err) {
                                                console.log(err.response)
                                                toast.error(err.response && err.response.data && err.response.data.message
                                                    ? err.response.data.message
                                                    : err.message, {
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
                                                        Update
                                                    </Button>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
