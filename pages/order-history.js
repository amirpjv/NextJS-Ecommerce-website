import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../utils/error';
import Link from 'next/link'
import Layout from '../components/Layout';
import Loading from '../components/Loading'
import { getOrderHistory } from '../store/order-slice';
import toast, { Toaster } from 'react-hot-toast';

function OrderHistory() {
    const [loading, setLoading] = useState(false)
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
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/orders/history`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getOrderHistory(data))
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);

    return (
        <Layout title="Order History">
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
                                    <Nav.Item className="ms-2"><Link href="/profile" passHref><Nav.Link className={isActive("/profile")}>User Profile</Nav.Link></Link></Nav.Item>
                                    <Nav.Item className="ms-2"><Link href="/order-history" passHref><Nav.Link className={isActive("/order-history")}>Order History</Nav.Link></Link></Nav.Item>
                                </Nav>
                            </Card>
                        </Col>
                        <Col className="col-10">
                            <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Card.Body className="d-flex flex-column align-items-start">
                                    <Card.Title className={`${darkStyleText} pt-2 ps-3 pb-2`}>Order History</Card.Title>
                                    <Table striped bordered hover>
                                        <thead className="text-center">
                                            <tr className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                <th width={'15%'}>Id</th>
                                                <th width={'20%'}>Date</th>
                                                <th width={'15%'}>Total</th>
                                                <th width={'15%'}>Paid</th>
                                                <th width={'20%'}>Delivered</th>
                                                <th width={'15%'}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-center align-middle">
                                            {orderHistory.map(item => {
                                                return (
                                                    <tr key={item._id} className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                        <td>{item._id.substring(19, 24)}</td>
                                                        <td>{item.createdAt}</td>
                                                        <td>${item.totalPrice}</td>
                                                        <td>
                                                            {orderHistory.isPaid ? `paid at ${orderHistory.paidAt}` : `not paid`}
                                                        </td>
                                                        <td>
                                                            {orderHistory.isDelivered ? `delivered at ${orderHistory.deliveredAt}` : `not delivered`}
                                                        </td>
                                                        <td>
                                                            <Button className="bg-warning border-0" onClick={() => router.push(`/order/${item._id}`)}>DETAILS</Button>
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });


{/* <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                <Card.Body className="d-flex flex-column align-items-start">
                                    <Card.Link className={`${darkStyleText}`} href="/profile">User Profile</Card.Link>
                                    <Card.Link className={`${darkStyleText}`} href="/order-history">Order History</Card.Link>
                                </Card.Body>
                            </Card> */}