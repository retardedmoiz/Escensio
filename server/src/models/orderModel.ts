import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: { type: String },
});

const orderSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: '' },
    paymentMethod: { 
        type: String, 
        enum: ['cod', 'bank', 'whatsapp'],
        default: 'cod'
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    notes: { type: String, default: '' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
