const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    console.log('Fetching categories...'); // Log before the query
    const categories = await Category.find();
    console.log('Categories fetched successfully:', categories); // Log on success
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message); // Log the error with details
    res.status(500).json({ message: 'Error fetching categories' });
  }
};


const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(200).json(category);
    } catch (error) {
      console.error('Error creating category:', error);  // Logs the exact error to the server console
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };

  // Fetch a single category by ID
// Fetch a single category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  console.log(`Fetching category with ID: ${id}`);  // Log the ID of the category being fetched

  try {
    const category = await Category.findById(id);

    if (!category) {
      console.log(`Category with ID: ${id} not found`);  // Log if the category is not found
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(`Successfully fetched category with ID: ${id}`);  // Log success
    res.json(category);
  } catch (error) {
    console.error(`Error fetching category with ID: ${id}`, error.message);  // Log any errors
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

  

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = {
  getCategoryById, 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
