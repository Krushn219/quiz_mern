const SubCategory = require("../models/SubCategory");
const Question = require("../models/Question");
const createError = require("../utils/error")
const fs = require("fs");
const Category = require("../models/Category");
const ApiFeatures = require("../utils/apifeature");
const uploadDirectory = 'uploads';


// Create
module.exports.create = async (req, res, next) => {
    const { subCategory_name, category, description } = req.body

    if (!subCategory_name || !category || !description) {
        return res.status(400).json({
            success: false,
            msg: "All Fields Required"
        })
    }

    const isExisted = await SubCategory.find({ subCategory_name: subCategory_name })
    if (isExisted.length > 0) {
        // Remove the previous image if it exists
        const imagePath = req.file.path;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        return res.status(400).json({
            success: false,
            msg: "Sub Category Already Exist!!"
        })
    }
    const normalizedImagePath = req.file.path.replace(/\\/g, '/');

    try {
        const subCategory = await SubCategory.create({
            subCategory_name: subCategory_name,
            category: category,
            description: description,
            image: normalizedImagePath,
        })

        if (!subCategory) {
            return res.status(400).json({
                success: false,
                msg: "Can not create category..."
            })
        }

        return res.status(201).json({
            success: true,
            msg: "Sub Category Created Successfully...",
            subCategory
        })

    } catch (error) {
        const imagePath = req.file.path;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Single Category Record
module.exports.getSingleSubCategory = async (req, res, next) => {
    const id = req.params.id;

    try {
        const subCategory = await SubCategory.findById(id)

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                msg: "Category Not Found!!"
            })
        }

        return res.status(200).json({
            success: true,
            subCategory
        })
    } catch (error) {
        next(error)
        // return res.status(500).json({
        //     success: false,
        //     msg: error
        // })
    }

}

// Get All Categories
module.exports.getAllSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.find()
            .populate('category', 'category image') 
            // .select('-_id subCategory_name description category.image')

            // console.log("subCategories+++",subCategories)

            const modifiedSubCategories = subCategories.map((subCategory) => ({
                _id: subCategory._id,
                subCategory_name:subCategory.subCategory_name,
                category_name: subCategory.category.category, 
                description: subCategory.description,
                image: subCategory.category.image,
                createdAt: subCategory.createdAt,
                updatedAt: subCategory.updatedAt,
                __v: subCategory.__v
            }));


        const count = await SubCategory.countDocuments();

        if (subCategories.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        return res.status(200).json({
            success: true,
            Total: count,
            subCategories:modifiedSubCategories
        })
    } catch (error) {
        console.log("Error+++",error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Update
module.exports.updateSubCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        const subCategory = await SubCategory.findById(id);

        if (!subCategory) {
            if (req.file) {
                // Remove the previous image if it exists
                const imagePath = req.file.path;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            return res.status(404).json({
                success: false,
                msg: 'Category Not Found!!',
            });
        }

        // Check if a new image is being uploaded
        if (req.file) {
            // Remove the previous image if it exists
            if (subCategory.image) {
                const imagePath = subCategory.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Update the category with the new image
            const subCategoryUpdate = await SubCategory.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...req.body,
                        image: req.file.path,
                    },
                },
                { new: true }
            );

            return res.status(201).json({
                success: true,
                msg: 'SubCategory Updated Successfully...',
                subCategoryUpdate,
            });
        } else {
            // No new image uploaded, update the category without changing the image
            const subCategoryUpdate = await SubCategory.findByIdAndUpdate(id, { $set: req.body }, { new: true });

            return res.status(201).json({
                success: true,
                msg: 'SubCategory Updated Successfully...',
                subCategoryUpdate,
            });
        }
    } catch (error) {
        // Remove the  image if it any error 
        const imagePath = req.file.path;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// Delete Single Record
module.exports.deleteSubCategory = async (req, res) => {
    const subCategoryId = req.params.id;

    try {
        const subcategory = await SubCategory.findById(subCategoryId)

        if (!subcategory) {
            return res.status(404).json({
                success: false,
                msg: "SubCategory Not Found!!"
            })
        }

        // Find all questions related to the category
        const relatedQuestions = await Question.find({ subcategory: subCategoryId });

        // Delete questions related to the category
        for (const question of relatedQuestions) {
            // Delete the image file associated with the question, if applicable
            if (question.image) {
                fs.unlink(question.image, (err) => {
                    if (err) {
                        console.error('Error deleting question image:', err);
                    } else {
                        console.log('Question image deleted successfully:', question.image);
                    }
                });
            }

            // Delete the question itself
            await Question.findByIdAndDelete(question._id);
        }

        // Delete the category image, if applicable
        if (subcategory.image) {
            fs.unlink(subcategory.image, (err) => {
                if (err) {
                    console.error('Error deleting category image:', err);
                } else {
                    console.log('sUB Category image deleted successfully:', subcategory.image);
                }
            });
        }

        const deleteSubcategory = await SubCategory.findByIdAndDelete(subCategoryId);

        return res.status(200).json({
            success: true,
            msg: "SubCategory Deleted Successfully..."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Get All SubCategories By Category
module.exports.getAllSubCategoryByCategory = async (req, res) => {
    const categoryId=req.params.categoryId
    try {
        const subCategories = await SubCategory.find({category:categoryId}).populate("category")

        const category = await Category.findById(categoryId)

        const count = await SubCategory.countDocuments();

        // Include the category image in the response
        const responseData = subCategories.map((subcategory) => ({
            _id:subcategory._id,
            subCategory_name: subcategory.subCategory_name,
            description: subcategory.description,
            image: category.image,
            category_name:category.category
        }));


        if (subCategories.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        return res.status(200).json({
            success: true,
            Total: count,
            count: subCategories.length,
            subCategories: responseData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Get all data for admin panel
// Get All Categories
module.exports.getallSubCategory = async (req, res) => {
    try {

        // Pagination
        const resultPerPage = Number(req.query.limit);
        const sort = {};

        if (req.query.sortBy && req.query.Question) {
            sort[req.query.sortBy] = req.query.Question === 'desc' ? -1 : 1
        }

        const apiFeature = new ApiFeatures(SubCategory.find().populate('category', 'category image').sort(sort), req.query)
            .filter()
            .search()
            .pagination(resultPerPage);
        let subCategories = await apiFeature.query;
        let filteredSubcategoryCount = subCategories.length;
        const count = await SubCategory.countDocuments();

        let totalPages;
        if(count >= 10){
             totalPages = Math.ceil(count / resultPerPage);
        }
        totalPages = 1;

        if (subCategories.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        return res.status(200).json({
            success: true,
            count,
            filteredSubcategoryCount,
            totalPages,
            subCategories
        })
    } catch (error) {
        console.log("Error+++", error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}


