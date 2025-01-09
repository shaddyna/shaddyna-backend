const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
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
const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.json(category);
    } catch (error) {
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
