import Layout from '../components/Layout'
import { Row, Col, Card, Carousel, Container } from 'react-bootstrap'
import React, { useState } from 'react'
import db from '../utils/db'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Product from '../models/Product'
import { useSelector, useDispatch } from 'react-redux';
import { addCartItem } from '../store/cart-slice';
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast';
import { Star, StarFill, StarHalf } from 'react-bootstrap-icons';

const Home = ({ topRatedProducts, featuredProducts }) => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch()
  const router = useRouter()
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const darkStyleText = `${darkMode ? 'text-white' : 'text-dark'}`
  const addToCartHandler = async (product) => {
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock <= 0) {
      toast.error('Sorry. Product is out of stock.')
      return
    }
    dispatch(addCartItem({ data }))
    router.push('/cart')
  }
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <Layout>
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
      <Col>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {featuredProducts.map((product) => (
            <Carousel.Item key={product._id} style={{ position: "relative", width: "100%", paddingBottom: "25%" }}>
              <Link href={`/product/${product.slug}`} passHref>
                <Image
                  src={product.featuredImage}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                {/* <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption> */}
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
        <h1 className={`${darkStyleText} mt-5`}>Popular Products</h1>
        <Row className="pb-2">
          {topRatedProducts.map((product) => {
            return (
              <Col className="col-md-4 col-sm-6 d-flex justify-content-around my-2" key={product.name}>
                <Card style={{ width: '18rem' }} className={`${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                  <Link href={`/product/${product.slug}`} passHref>
                    <a className="p-0">
                      <Image width="286" height="286" src={product.image} id="card-image" className="mb-2" alt={`${product.name}`} />
                      {/* <Card.Img variant="top" src={product.image} id="card-image" className="mb-2" /> */}
                    </a>
                  </Link>
                  <Card.Body>
                    <Card.Title className={`${darkStyleText}`}>{product.name}</Card.Title>
                    {product.rating === 0 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating < 1 && product.rating > 0 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating === 1 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating < 2 && product.rating > 1 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating === 2 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating < 3 && product.rating > 2 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating === 3 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating < 4 && product.rating > 3 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating === 4 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><Star className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating < 5 && product.rating > 4 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarHalf className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                    {product.rating === 5 &&
                      <Card.Text className={`${darkStyleText} border-0`}>
                        <StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" /><StarFill className="text-warning" id="star" />({product.numReviews} reviews)
                      </Card.Text>
                    }
                  </Card.Body>
                  <Card.Body style={{ marginTop: '-1.5rem' }} className="d-flex justify-content-start">
                    <Card.Text className={`${darkStyleText} fw-bold me-3`}>${product.price}</Card.Text>
                    <Card.Link style={{ cursor: 'pointer' }} className="text-uppercase text-warning text-decoration-none fw-bold" onClick={() => addToCartHandler(product)}>add to cart</Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Col>
    </Layout>
  )
}
export default Home

export async function getServerSideProps() {
  await db.connect();
  const featuredProductsDocs = await Product.find(
    { isFeatured: true },
    '-reviews'
  )
    .lean()
    .limit(3);
  const topRatedProductsDocs = await Product.find({}, '-reviews')
    .lean()
    .sort({
      rating: -1,
    })
    .limit(6);
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
      topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
    },
  };
}
