import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.status(200).send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (!product) {
    await db.disconnect();
    return res.status(404).send({ message: 'Product Not Found' });
  }
  const newProduct = await Product.findOneAndUpdate({
    _id: req.query.id
  }, {
    name: req.body.name,
    slug: req.body.slug,
    price: req.body.price,
    category: req.body.category,
    image: req.body.image,
    featuredImage: req.body.featuredImage,
    isFeatured: req.body.isFeatured,
    brand: req.body.brand,
    countInStock: req.body.countInStock,
    description: req.body.description
  }, {
    new: true
  })
  await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Updated Successfully' });
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default handler;
