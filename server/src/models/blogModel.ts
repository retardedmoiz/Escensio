import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    category: { 
        type: String, 
        required: true, 
        enum: ['Guide', 'Education', 'News', 'Brand Story', 'Behind the Scenes'],
        default: 'News'
    },
    image: { type: String, default: '' },
    author: { type: String, default: 'Escensio Team' },
    isPublished: { type: Boolean, default: true },
    slug: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate slug from title
blogSchema.pre('save', function(next: any) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    // @ts-ignore
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
