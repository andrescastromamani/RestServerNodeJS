const { Category } = require('../models');
//Get All Categpries
const getCategories = async (req, res) => {
    const { limit = 10, from = 0 } = req.query
    const query = { status: true }
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ])
    res.json({
        total,
        categories
    });
}

//Get Category by Id
const getCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate('user', 'name');
    res.json({
        category
    })
}

//Create Category
const createCategory = async (req, res) => {
    const { name } = req.body;
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
        return res.status(400).json({
            message: 'Category already exist'
        });
    }
    //Generate Data
    const data = {
        name,
        user: req.user._id
    }
    const category = new Category(data);
    category.save();
    res.status(201).json({
        message: 'Category created successfully'
    });
}

//Update Category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { _id,status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    res.json({
        category
    });
}

//Delete Category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false });
    res.json({
        category
    });
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}