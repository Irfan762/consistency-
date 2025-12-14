const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    url: {
        type: String,
        default: '',
    },
    // In a relational view, we might not need to store task IDs here if we query Tasks by hackathonId
    // But the frontend type has 'tasks: string[]'. I'll keep it for now to match, 
    // but usually it's better to virtualize this.
    // For simplicity of "adding backend" to match existing data shape:
    tasks: [{
        type: String, // Storing Task IDs
        ref: 'Task'
    }]
}, {
    timestamps: true, // adds createdAt
});

hackathonSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
