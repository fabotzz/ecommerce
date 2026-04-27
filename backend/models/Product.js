import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  name: { type: String, required: [true, 'Name is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  description: { type: String, required: [true, 'Description is required'] },
  category: { type: String, required: [true, 'Category is required'], enum: ['Clothing', 'Footwear', 'Electronics', 'Accessories'] },
  inStock: { type: Boolean, default: true },
  image: { type: String, default: 'https://via.placeholder.com/300' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);