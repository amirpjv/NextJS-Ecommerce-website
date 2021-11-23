import React, { Fragment } from 'react'
import Layout from '../components/Layout'
import { Row, Container, Button, Card, Table } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { decreaseCartItem, increaseCartItem, removeCartItem } from '../store/cart-slice';

const CartScreen = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
  const checkoutHandler = () => {
    router.push('/shipping')
  }
  return (
    <Layout title="Shopping Cart">
      <Fragment>
        <h1 className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>Shopping Cart</h1>
        {cartItems.length === 0
          ?
          <Fragment>
            <Container fluid className="d-flex flex-column align-items-center">
              <p>Cart is empty.</p>
              <Link href="/" passHref>
                <Button variant="outline-warning" className="w-25">Go Shopping</Button>
              </Link>
            </Container>
          </Fragment>
          :
          <Fragment>
            <Container fluid>
              <Row>
                <Table striped bordered hover>
                  <thead className="text-center">
                    <tr className={`${darkStyleText} pt-2 ps-3 ms-5 pb-2`}>
                      <th width={'15%'}>Image</th>
                      <th width={'15%'}>Name</th>
                      <th width={'10%'}>Price</th>
                      <th width={'10%'}>Quantity</th>
                      <th width={'20%'}>Actions</th>
                      <th width={'10%'}>Total Price</th>
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
                          <td>
                            <Button variant="success" onClick={() => dispatch(increaseCartItem(item._id))} disabled={item.countInStock === item.quantity ? true : false}>+</Button>
                            <Button variant="primary" className="mx-lg-3 mx-md-2 mx-sm-1 mx-xl-4" onClick={() => dispatch(decreaseCartItem(item._id))}>-</Button>
                            <Button variant="danger" onClick={() => dispatch(removeCartItem(item._id))}>x</Button>
                          </td>
                          <td>${item.price * item.quantity}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </Row>
              <Row className="d-flex justify-content-center pb-3">
                <Card style={{ width: '20rem' }} className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title className={`${darkStyleText}`}>GRAND TOTAL: ${totalPrice}</Card.Title>
                    <Card.Text className={`${darkStyleText}`}>TOTAL ITEMS: {totalQuantity}</Card.Text>
                  </Card.Body>
                  <Card.Body className="d-flex justify-content-center">
                    <Button variant="warning" className="w-100" onClick={checkoutHandler}>CHECK OUT</Button>
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          </Fragment>
        }
      </Fragment>
    </Layout >
  )
}
export default CartScreen


{/* <Dropdown>
                            <Dropdown.Toggle variant="outline-warning">
                              Color
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Red</Dropdown.Item>
                              <Dropdown.Item href="#/action-1">Blue</Dropdown.Item>
                              <Dropdown.Item href="#/action-1">Green</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown> */}