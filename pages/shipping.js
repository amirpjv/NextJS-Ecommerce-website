import React, { Fragment, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'
import { userShippingAddress, getUserShippingAddress, getUser } from '../store/user-slice';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'
import Loading from '../components/Loading'
import dynamic from 'next/dynamic'

function Shipping() {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.user.userInfo);
    const shippingAddress = useSelector((state) => state.user.shippingAddress);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    useEffect(() => {
        dispatch(getUser())
        if (!userInfo) {
            router.push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [postalCode, setPostalCode] = useState('')

    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        if (fullName === '' || address === '' || city === '' || province === '' || postalCode === '') {
            toast.error('Please fill out all fields', {
                duration: 4000,
                position: 'top-center',
                // icon: '👏',
            });
            return
        }
        const newShippingAddress = { fullName, address, city, province, postalCode }
        dispatch(userShippingAddress(newShippingAddress))
        router.push('/payment')
    }
    useEffect(() => {
        dispatch(getUserShippingAddress())
        if (shippingAddress === '') {
            return
        }
        setFullName(shippingAddress.fullName)
        setAddress(shippingAddress.address)
        setCity(shippingAddress.city)
        setProvince(shippingAddress.province)
        setPostalCode(shippingAddress.postalCode)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout title="Shipping">
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
            {!userInfo ? <Loading/> :
            <Fragment>
                <Container fluid className="my-auto d-flex flex-column" style={{ minHeight: `80vh` }}>
                    <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 d-flex justify-content-start align-content-start align-items-start`}>Shipping Address</h1>
                    <Row className="my-auto">
                        <Col className="col-10 d-flex flex-column mx-auto">
                            <Container className="w-50 justify-content-center">
                                <Form className={`${darkStyleText} mb-5`} onSubmit={submitHandler}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="fullName">
                                            <Form.Label>Full name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter full name" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="province">
                                            <Form.Label>Province</Form.Label>
                                            <Form.Control type="text" placeholder="Province" name="province" value={province} onChange={(e) => setProvince(e.target.value)} required />
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control placeholder="1234 Main St" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="city">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control onChange={(e) => setCity(e.target.value)} name="city" value={city} required />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="postalCode">
                                            <Form.Label>Postal code</Form.Label>
                                            <Form.Control onChange={(e) => setPostalCode(e.target.value)} name="postalCode" value={postalCode} required />
                                        </Form.Group>
                                    </Row>

                                    <Button variant="warning" type="submit" className="w-100 mt-2">
                                        Continue
                                    </Button>
                                </Form>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Fragment>}
        </Layout >
    )
}

export default dynamic(() => Promise.resolve(Shipping), { ssr: false })