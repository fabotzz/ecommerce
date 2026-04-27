import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ tenantId: req.tenantId });
    res.json(products);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, tenantId: req.tenantId });
    res.status(201).json(product);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product removed successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { tenantId: req.tenantId });
    res.json(categories);
  } catch (error) { res.status(500).json({ error: error.message }); }
};