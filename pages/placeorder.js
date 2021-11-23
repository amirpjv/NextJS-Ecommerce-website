import React, { Fragment, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Row, Container, Button, Card, Table, Col, Spinner } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { removeCartItems } from '../store/cart-slice';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../components/Loading'
import axios from 'axios'
import Cookies from 'js-cookie'

function PlaceOrder() {
    const [loading, setLoading] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.user.userInfo);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const shippingAddress = useSelector((state) => state.user.shippingAddress);
    const paymentMethod = useSelector((state) => state.user.paymentMethod);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
    const taxPrice = totalPrice * 0.15
    const shippingPrice = totalPrice > 200 ? 0 : 15
    const finalPrice = taxPrice + shippingPrice + totalPrice
    const placeOrderHandler = async (e) => {
        setIsSubmit(true)
        e.preventDefault()
        toast.dismiss()
        setLoading(true)
        try {
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: totalPrice,
                shippingPrice,
                taxPrice,
                totalPrice: finalPrice,
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch(removeCartItems())
            setLoading(false)
            router.push(`/order/${data._id}`)
        } catch (err) {
            setLoading(false)
            // console.log(err.message)
            toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : err.message)
        }
    }
    useEffect(() => {
        setIsSubmit(false)
        const cartExist = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : []
        if (!paymentMethod) {
            router.push('/payment')
        }
        if (cartExist.length === 0) {
            router.push('/cart')
        }
    }, [])
    return (
        <Layout title="Place Order">
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
                    <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>Place Order</h1>
                    <Container fluid>
                        <Row>
                            <Col lg={9} className="d-flex flex-column justify-content-center">
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} mb-2`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Shipping Address</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>
                                            Zip Code: {shippingAddress.postalCode} --- Address: {shippingAddress.address},{shippingAddress.city},{shippingAddress.province}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'} mb-2`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Payment Method</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>
                                            {paymentMethod}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                {isSubmit ? <Spinner animation="border" variant="warning" className="d-flex mx-auto" /> :
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
                                            {cartItems.map(item => {
                                                return (
                                                    <tr key={item._id} className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                                                        <td>
                                                            <Link href={`/product/${item.slug}`} passHref>
                                                                <a><Image src={item.image} alt={item.name} width={50} height={50}></Image></a>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            <Link href={`/product/${item.slug}`} passHref><a className="text-warning text-decoration-none">{item.name}</a></Link>
                                                        </td>
                                                        <td>${item.price}</td>
                                                        <td>
                                                            {item.quantity}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>}
                            </Col>
                            <Col lg={3}>
                                <Card className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                                    <Card.Body className="d-flex flex-column align-items-start">
                                        <Card.Title className={`${darkStyleText}`}>Order Summery</Card.Title>
                                        <Card.Text className={`${darkStyleText}`}>Items: ${totalPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Tax: {taxPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Shipping: ${shippingPrice}</Card.Text>
                                        <Card.Text className={`${darkStyleText}`}>Total: ${round2(finalPrice)}</Card.Text>
                                    </Card.Body>
                                    <Card.Body className="d-flex justify-content-center">
                                        <Button variant="warning" className="w-100" onClick={placeOrderHandler}>Order</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Fragment>}
        </Layout >
    )
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })