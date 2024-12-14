const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: 'config.env' });
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [32, 'Name must be less than 32 characters long'],
    unique: [true, "Category name must be unique."]
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true // Ensure slug uniqueness
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: String,
},



  {
    timestamps: true
  },

);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
categorySchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
categorySchema.post('save', (doc) => {
  setImageURL(doc);
});



const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
