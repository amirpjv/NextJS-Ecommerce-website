import React, { Fragment, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'
import { userPaymentMethod, getUserPaymentMethod } from '../store/user-slice';
import { Radio, RadioGroup } from 'react-radio-group'
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic'

function Payment() {
    const router = useRouter()
    const dispatch = useDispatch()
    const shippingAddress = useSelector((state) => state.user.shippingAddress);
    const paymentMethodState = useSelector((state) => state.user.paymentMethod);
    const darkMode = useSelector((state) => state.darkMode.darkMode);
    const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
    useEffect(() => {
        if (!shippingAddress) {
            router.push('/shipping');
        }
    }, [])
    useEffect(() => {
        dispatch(getUserPaymentMethod())
        if (paymentMethodState === null) {
            return
        }
        setPaymentMethod(paymentMethodState)
    }, [])
    const [paymentMethod, setPaymentMethod] = useState('')
    const submitHandler = async (e) => {
        e.preventDefault()
        toast.dismiss()
        if (!paymentMethod) {
            toast.error('Payment method is required', {
                duration: 4000,
                position: 'top-center',
                // icon: '👏',
            });
            return
        }
        dispatch(userPaymentMethod(paymentMethod))
        router.push('/placeorder')
    }

    return (
        <Layout title="Payment">
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
            <Fragment>
                <Container fluid className="my-auto d-flex flex-column" style={{ minHeight: `80vh` }}>
                    <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 d-flex justify-content-start align-content-start align-items-start`}>Payment Method</h1>
                    <Row className="my-auto">
                        <Col className="col-10 d-flex flex-column mx-auto">
                            <Container className="w-50 justify-content-center">
                                <Form className={`${darkStyleText} mb-5`} onSubmit={submitHandler}>
                                    <RadioGroup name="paymentMethod" className="d-flex flex-column justify-content-start mb-3 fs-3">
                                        <Container>
                                            <Radio value="paypal" className="mx-3" onClick={(e) => setPaymentMethod(e.target.value)} />Paypal
                                            </Container>
                                        <Container>
                                            <Radio value="stripe" className="my-3 mx-3" onClick={(e) => setPaymentMethod(e.target.value)} />Stripe
                                            </Container>
                                        <Container>
                                            <Radio value="cash" className="mx-3" onClick={(e) => setPaymentMethod(e.target.value)} />Cash
                                            </Container>
                                    </RadioGroup>
                                    <Button variant="warning" type="submit" className="w-100 my-2">
                                        Continue
                                    </Button>
                                    <Button variant="secondary" type="button" className="w-100 mt-2" onClick={() => router.push('/shipping')}>
                                        Back
                                    </Button>
                                </Form>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Fragment >
        </Layout >
    )
}

export default dynamic(() => Promise.resolve(Payment), { ssr: false })