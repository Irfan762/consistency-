const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    category: {
        type: String,
        enum: ['daily', 'learning', 'hackathon', 'project'],
        default: 'daily',
    },
    hackathonId: {
        type: String, // Keeping as String to match frontend UUIDs if we stick to them, or simpler Ref later
        ref: 'Hackathon',
        required: false,
    },
}, {
    timestamps: true, // This adds createdAt and updatedAt automatically
});

// Convert _id to id for frontend compatibility
taskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Task', taskSchema);
