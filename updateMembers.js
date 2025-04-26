const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb+srv://Mizzo:Sammy2001%40@cluster0.bvaggu8.mongodb.net/newshaddyna?retryWrites=true&w=majority&appName=Cluster0'; // replace with your actual URI

const updateUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await User.updateMany(
      { member: { $exists: false } },
      { $set: { member: false } }
    );

    console.log(`Updated ${result.modifiedCount} users.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating users:', error);
    mongoose.connection.close();
  }
};

updateUsers();
