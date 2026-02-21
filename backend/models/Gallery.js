const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'renovation', 'design'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: String,
  beforeImage: String,
  afterImage: String,
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);