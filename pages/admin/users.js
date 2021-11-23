import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav, Spinner, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../../utils/error';
import Link from 'next/link'
import Layout from '../../components/Layout';
import Loading from '../../components/Loading'
import { getUsers, deleteUser } from '../../store/user-slice';
import toast, { Toaster } from 'react-hot-toast';

function AdminUsers() {
    const [loading, setLoading] = useState(false)
    const [userID, setUserID] = useState('')
    const [showDelete, setShowDelete] = useState(false);
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
    const users = useSelector((state) => state.user.users);
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
            const { data } = await axios.get(`/api/admin/users`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getUsers(data))
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);

const deleteHandler = async (userId) => {
    setShowDelete(false)
    try {
        setLoading(true)
        await axios.delete(`/api/admin/users/${userId}`,
            {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
        toast.success("User deleted successfully")
        dispatch(deleteUser(userId))
        setLoading(false)
    } catch (err) {
        setLoading(false)
        toast.error(err)
    }
}
const handleClose = () => {
    setShowDelete(false)
}
const handleShowDelete = (user) => {
    setUserID(user)
    setShowDelete(true);
}

return (
    <Layout title="Admin Users">
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
        <Modal show={showDelete} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Please confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete user?</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => deleteHandler(userID)}>
                    Yes
                    </Button>
                <Button variant="success" onClick={handleClose}>
                    No
                    </Button>
            </Modal.Footer>
        </Modal>
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
                                <Card.Title className={`${darkStyleText} my-2`}>Users</Card.Title>
                                <Table striped bordered hover>
                                    <thead className="text-center">
                                        <tr className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                            <th width={'15%'}>Id</th>
                                            <th width={'20%'}>Name</th>
                                            <th width={'25%'}>Email</th>
                                            <th width={'10%'}>Admin</th>
                                            <th width={'20%'}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center align-middle">
                                        {users.map(user => {
                                            return (
                                                <tr key={user._id} className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                    <td>{user._id.substring(19, 24)}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                                    <td>
                                                        <Button size="sm" className="bg-info border-0" onClick={() => router.push(`/admin/user/${user._id}`)}>Edit</Button>{' '}
                                                        <Button size="sm" className="bg-danger border-0" onClick={() => handleShowDelete(user._id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>}
    </Layout>
);
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });