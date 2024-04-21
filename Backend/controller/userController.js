// Import necessary modules and User model
const mongoose = require("mongoose");
const Performance = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cron = require('node-cron'); // Import node-cron

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    name: user.name,
    email: user.email,
  };

  const options = {
    expiresIn: "1h", // token expiration time
  };

  return jwt.sign(payload, process.env.MY_SECRET, options);
}
//random updates to the database
const updateMetrics = async () => {
  const data = await Performance.find({});
  data.forEach(async item => {
    const updatedMetrics = {};
    Object.keys(item.performance_metrics).forEach(key => {
      updatedMetrics[key] = Math.floor(Math.random() * 61) + 30; // Generate random value between 30 and 90
    });
    await Performance.updateOne({ _id: item._id }, { $set: { performance_metrics: updatedMetrics } });
  });
  console.log('Data updated successfully.');
};
// Schedule cron job to run updateMetrics every day at midnight
cron.schedule('*/5 * * * * *', () => {
  updateMetrics();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // Set your timezone here
});

// Function to fetch all active users
const findAllPerfomance = async (req, res) => {
  try {
    // Find all users with "Active" status
    const data = await Performance.find({});
    const transformedData = data.map(item => {
      const performanceMetricsValues = Object.values(item.performance_metrics);
      return {
          performance_metrics: performanceMetricsValues,
          _id: item._id,
          company_id: item.company_id,
          year: item.year
      };
  });
    res.json({ message: "Perfomance data fetched.", data: transformedData });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Function to check user login credentials
const loginCheck = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find a user with the provided email and password
    const user = await Performance.findOne({ email, password });

    if (!user) {
      return res.json({ error: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.json({ message: "Login successful", token: token, data: user });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Function to update a user by their ID
const updatePerfomance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ error: "No such user" });
    }

    // Find and update a user by their ID with the provided data
    const record = await Performance.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );

    if (!record) {
      return res.json({ error: "No such data" });
    }

    res.json({
      message: "Updated data successfully.",
      data: user,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Export all functions for use in other parts of the application
module.exports = {
  findAllPerfomance,
  updatePerfomance,
  loginCheck,
};
