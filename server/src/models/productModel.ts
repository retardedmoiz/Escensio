import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // The artisan
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Men\'s', 'Women\'s', 'Unisex', 'Best Sellers'] },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
