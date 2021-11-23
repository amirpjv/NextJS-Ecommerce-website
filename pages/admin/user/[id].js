import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState, Fragment } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav, Spinner, Form, InputGroup } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../../../utils/error';
import Link from 'next/link'
import Layout from '../../../components/Layout';
import Loading from '../../../components/Loading'
import { getAdminUser } from '../../../store/user-slice';
import toast, { Toaster } from 'react-hot-toast';

function UserEdit({ params }) {
    const [loading, setLoading] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [values, setValues] = useState({
        name: '',
        email: ''
    })
    const userId = params.id
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
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
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/admin/users/${userId}`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getAdminUser(data))
            setValues({
                name: data.name,
                email: data.email,
            })
            setIsAdmin(data.isAdmin)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        try {
            await axios.put(`/api/admin/users/${userId}`, {
                name: values.name,
                email: values.email,
                isAdmin
            },
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
            toast.success("User updated successfully.")
            router.push('/admin/users')
        } catch (err) {
            toast.error(err)
        }
    }
    const changeHandler = (e) => {
        if (e.target.type === "checkbox") {
            setIsAdmin(!isAdmin)
        }
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    return (
        <Layout title="Edit User">
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
            {loading ? <Loading /> :
                <Container fluid>
                    <Row className="d-flex justify-content-center py-3">
                        <Col className="col-2">
                            <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Nav className="d-flex flex-column justify-content-start fs-6">
                                    <Nav.Item className="ms-2"><Link href="/admin/dashboard" passHref><Nav.Link className={isActive("/admin/dashboard")}>Admin Dashboard</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/orders" passHref><Nav.Link className={isActive("/admin/orders")}>Orders</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/products" passHref><Nav.Link className={isActive("/admin/products")}>Products</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/admin/users" passHref><Nav.Link className={isActive("/admin/users")}>Users</Nav.Link></Link></Nav.Item>
                                </Nav>
                            </Card>
                        </Col>
                        <Col className="col-10">
                            <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Card.Body className="d-flex flex-column align-items-start">
                                    <Card.Title className={`${darkStyleText} pt-2 ps-3 pb-2`}>Edit User {`${userId}`}</Card.Title>
                                    <Form className={`${darkStyleText} w-100`} onSubmit={submitHandler}>
                                        <Form.Group className="mb-2" controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter name"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-2" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={changeHandler}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="checkbox">
                                            <Form.Check type="checkbox" label="Is Admin" checked={isAdmin ? true : false} onChange={changeHandler} />
                                        </Form.Group>
                                        <Button variant="warning" type="submit" className="w-100 mb-3">
                                            Update
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>}
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return { props: { params } }
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });