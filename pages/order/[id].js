import React, { Fragment, useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Row, Container, Spinner, Card, Table, Col, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { getOrder, deliverRequest, deliveredSuccess, paySuccess, payFail, payReset } from '../../store/order-slice';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import Loading from '../../components/Loading'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

// function Order({ params }) {
const Order = ({ params }) => {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const orderId = params.id
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
    const router = useRouter()
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order.order);
    const userInfo = useSelector((state) => state.user.userInfo);
    const successPay = useSelector((state) => state.order.successPay);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100

    //eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (!userInfo) {
            setLoading(false)
            return router.push('/login')
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            if (successPay) {
                dispatch(payReset())
            }
            try {
                setLoading(true)
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch(getOrder(data))
                setLoading(false)
            } catch (err) {
                setLoading(false)
                setError(true)
                toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message)
            }
        } else {
            try {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                paypalDispatch({
                    type: 'resetOptions', value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            } catch (err) {
                setLoading(false)
                setError(true)
                toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message)
            }
        }
    }, [order, successPay])

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice },
                    },
                ],
            })
            .then((orderID) => {
                return orderID;
            });
    }
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                setLoading(true)
                const { data } = await axios.put(
                    `/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch(paySuccess(data));
                setLoading(false)
                toast.success('Order is paid.')
            } catch (err) {
                setLoading(false)
                dispatch(payFail());
                toast.error(err)
            }
        });
    }
    function onError(err) {
        toast.error(err)
    }

    const deliverOrderHandler = async () => {
        try {
            dispatch(deliverRequest())
            const { data } = await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch(deliveredSuccess(data));
            toast.success('Order is delivered.')
        } catch (err) {
            toast.error(err)
        }
    }

    return (
        <Layout title="Order Details">
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
                <Fragment>
                    <h1 className={`${darkStyleText} pt-2 ps-3 pb-2`}>Order {orderId}</h1>
                    <Container fluid>
                        <Row>
                            <Col lg={9} className="d-flex flex-column justify-content-center">
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} mb-2`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Shipping Address</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>
                                            Zip Code: {order.shippingAddress.postalCode} --- Address: {order.shippingAddress.address},{order.shippingAddress.city},{order.shippingAddress.province}<br />
                                            Status: {order.isDelivered ? "Delivered" : "Not delivered"}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} mb-2`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Payment Method</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>
                                            {order.paymentMethod}<br />
                                            Status: {order.isPaid ? "Paid" : "Not paid"}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <Table striped bordered hover>
                                    <thead className="text-center">
                                        <tr className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                            <th width={'20%'}>Image</th>
                                            <th width={'20%'}>Name</th>
                                            <th width={'15%'}>Price</th>
                                            <th width={'15%'}>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center align-middle">
                                        {order.orderItems.map(item => {
                                            return (
                                                <tr key={item._id} className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                    <td>
                                                        <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                    </td>
                                                    <td>
                                                        <h4>{item.name}</h4>
                                                    </td>
                                                    <td>${item.price}</td>
                                                    <td>
                                                        {item.quantity}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col lg={3}>
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} mb-2`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Order Summery</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>Items: ${order.itemsPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Tax: {order.taxPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Shipping: ${order.shippingPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Total: ${round2(order.totalPrice)}</Card.Text>
                                    </Card.Body>
                                    {
                                        !(order.isPaid) && (
                                            <Card.Body className="d-flex flex-column justify-content-center align-items-start text-center">
                                                { isPending ? (
                                                    <Spinner animation="border" variant="warning" className="d-flex mx-auto" />
                                                ) : (
                                                        <div className="w-100"><PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons></div>
                                                    )}
                                            </Card.Body>
                                        )}
                                    {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <Button variant="warning" className="w-75 mb-3 mx-auto" onClick={deliverOrderHandler}>Deliver Order</Button>
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Fragment>}
        </Layout >
    )
}

export default Order

export async function getServerSideProps({ params }) {
    return { props: { params } }
}

// export default dynamic(() => Promise.resolve(Order), { ssr: false })

