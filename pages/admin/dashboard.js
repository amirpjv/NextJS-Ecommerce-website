import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Row, Container, Button, Card, Table, Col, Nav ,Spinner} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { getError } from '../../utils/error';
import Link from 'next/link'
import Layout from '../../components/Layout';
import Loading from '../../components/Loading'
import { getSummery } from '../../store/admin-slice';
import toast, { Toaster } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2'

function AdminDashboard() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const userInfo = useSelector((state) => state.user.userInfo);
    const summery = useSelector((state) => state.admin.adminSummery);
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
            const { data } = await axios.get(`/api/admin/summery`, {
                headers: { authorization: `Bearer ${userInfo.token}` },
            });
            dispatch(getSummery(data))
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err)
        }
    }, []);

    return (
        <Layout title="Admin Dashboard">
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
                            <Card>
                                <Row className="d-flex justify-content-evenly">
                                    <Col className="col-3">
                                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} m-2`}>
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <h3>${summery.ordersPrice}</h3>
                                                <h4>Sales</h4>
                                                <Link href="/admin/orders" passHref>
                                                    <a className="text-warning text-decoration-none text-center mx-auto">View sales</a>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col className="col-3">
                                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} m-2`}>
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <h3>{summery.ordersCount}</h3>
                                                <h4>Orders</h4>
                                                <Link href="/admin/orders" passHref>
                                                    <a className="text-warning text-decoration-none text-center mx-auto">View orders</a>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col className="col-3">
                                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} m-2`}>
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <h3>{summery.productsCount}</h3>
                                                <h4>Products</h4>
                                                <Link href="/admin/products" passHref>
                                                    <a className="text-warning text-decoration-none text-center mx-auto">View products</a>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col className="col-3">
                                        <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} m-2`}>
                                            <Card.Body className="d-flex flex-column align-items-start">
                                                <h3>{summery.usersCount}</h3>
                                                <h4>Users</h4>
                                                <Link href="/admin/users" passHref>
                                                    <a className="text-warning text-decoration-none text-center mx-auto">View users</a>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="col-12">
                                        <Card.Title className={`${darkStyleText} pt-2 ps-3 pb-2 fs-3`}>Sales Chart</Card.Title>
                                        {!(summery.salesData) ? <Spinner animation="border" variant="warning" className="d-flex mx-auto mt-3" /> :
                                            <Bar className="m-3" data={{
                                                labels: summery.salesData.map((x) => x._id),
                                                datasets: [{
                                                    label: 'Sales',
                                                    backgroundColor: 'rgba(162,222,208,1)',
                                                    data: summery.salesData.map((x) => x.totalSales),
                                                }]
                                            }}
                                                options={{
                                                    legend: { display: true, position: 'right' },
                                                }}
                                            >
                                            </Bar>}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Container>}
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });