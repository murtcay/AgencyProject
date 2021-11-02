const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    subtitle: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    client: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    image: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }

});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;