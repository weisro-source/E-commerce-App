const express = require('express');
const User = require('../models/user');
const mongoose = require('mongoose');

const router = express.Router();

// Route to create a new user
router.post('/add-user', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validate input
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and age are required fields',
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      age
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: newUser,
    });

  } catch (error) {
    // Check for specific error types
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
      });
    } else if (error.code === 11000) {
      // Duplicate key error (e.g., unique constraint on email)
      return res.status(400).json({
        success: false,
        error: 'Duplicate email address, please use another one.',
      });
    } else {
      // General error
      return res.status(500).json({
        success: false,
        error: `${error}`,
      });
    }
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error, please try again later',
    });
  }
});

// Route to get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format',
      });
    }

    const user = await User.findById(id);  // Fetch the user by ID

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error, please try again later',
    });
  }
});

// Route to delete all users
// router.delete('/users', async (req, res) => {
//   try {
//     await User.deleteMany();
//     res.status(200).json({
//       success: true,
//       message: 'All users deleted successfully'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error, please try again later',
//     });
//   }
// });

// Route to delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format',
      });
    }

    // Attempt to find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error, please try again later',
    });
  }
});
router.delete("/users", async (req, res) => {

  try {
    const { ids } = req.body

    for (let index = 0; index < ids.length; index++) {
      if (mongoose.Types.ObjectId.isValid(ids[index])) {
        await User.findByIdAndDelete(ids[index]);

      } else {
        res.status(400).json({
          success: false,
          error: "Invalid user ID format",
          data: ids[index]
        });
      }

    }
    res.status(200).json({
      success: true,
      message: `deleted `
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error,
    });
  }

});

module.exports = router;
