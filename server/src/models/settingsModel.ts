import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String, default: 'general' },
    label: { type: String },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
