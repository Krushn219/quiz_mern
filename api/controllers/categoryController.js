const Category = require("../models/Category");
const Question = require("../models/Question");
const Subcategory = require("../models/SubCategory");
const ApiFeatures = require("../utils/apifeature");
const createError = require("../utils/error")
const fs = require("fs")
const uploadDirectory = 'uploads';


// Create
module.exports.create = async (req, res, next) => {
    const { quizname, category, description } = req.body

    if (!category || !description) {
        return res.status(404).json({
            success: false,
            msg: "All Fields Required"
        })
    }

    const isExisted = await Category.find({ category: category })
    if (isExisted.length > 0) {
        return res.status(400).json({
            success: false,
            msg: "Category Already Exist!!"
        })
    }
    const normalizedImagePath = req.file.path.replace(/\\/g, '/');

    try {
        const categoryCreate = await Category.create({
            quizname: quizname,
            category: category,
            description: description,
            image: normalizedImagePath,
        })

        if (!category) {
            return res.status(400).json({
                success: false,
                msg: "Can not create category..."
            })
        }

        return res.status(201).json({
            success: true,
            msg: "Category Created Successfully...",
            categoryCreate
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Update
module.exports.updateCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        const category = await Category.findById(id);

        if (!category) {
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
            if (category.image) {
                const imagePath = category.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Update the category with the new image
            const categoryUpdate = await Category.findByIdAndUpdate(
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
                msg: 'Category Updated Successfully...',
                categoryUpdate,
            });
        } else {
            // No new image uploaded, update the category without changing the image
            const categoryUpdate = await Category.findByIdAndUpdate(id, { $set: req.body }, { new: true });

            return res.status(201).json({
                success: true,
                msg: 'Category Updated Successfully...',
                categoryUpdate,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// Single Category Record
module.exports.getSingleCategory = async (req, res, next) => {
    const id = req.params.id;

    try {
        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category Not Found!!"
            })
        }

        return res.status(200).json({
            success: true,
            category
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
module.exports.getAllCategory = async (req, res) => {
    try {
        // const categories = await Category.find({category:req.query.category})
        if (req.query.category == "all") {
            const categories = await Category.find()

            const count = await Category.countDocuments();

            if (categories.length === 0) {
                return res.send({
                    categories: []
                })
            }

            const modifiedCategories = categories.map((category) => ({
                _id: category._id,
                category_name: category.category,
                description: category.description,
                image: category.image,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                __v: category.__v
            }));

            return res.status(200).json({
                success: true,
                Total: count,
                count: categories.length,
                categories: modifiedCategories
            })

        }
        const categories = await Category.find(req.query)

        const count = await Category.countDocuments();

        if (categories.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        const modifiedCategories = categories.map((category) => ({
            _id: category._id,
            category_name: category.category,
            description: category.description,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            __v: category.__v
        }));

        return res.status(200).json({
            success: true,
            Total: count,
            count: categories.length,
            categories: modifiedCategories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

module.exports.getallCategory = async (req, res) => {
    try {
        // const categories = await Category.find()

        const count = await Category.countDocuments();
        // Pagination
        const resultPerPage = Number(req.query.limit) || 10;
        const sort = {};

        if (req.query.sortBy && req.query.Question) {
            sort[req.query.sortBy] = req.query.Question === 'desc' ? -1 : 1
        }

        const apiFeature = new ApiFeatures(Category.find().sort(sort), req.query)
            .filter()
            .search()
            .pagination(resultPerPage);
        let categories = await apiFeature.query;
        let filteredCategoryCount = categories.length;

        let totalPages;
        if (count >= 10) {
            totalPages = Math.ceil(count / resultPerPage);
        }
        totalPages = 1;

        if (categories.length === 0) {
            return res.send({
                subCategories: []
            })
        }

        return res.status(200).json({
            success: true,
            count,
            filteredCategoryCount,
            totalPages,
            page: req.query.page,
            limit: resultPerPage,
            categories
        })
    } catch (error) {
        console.log("Error+++", error)
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}

// Delete Single Record
module.exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const category = await Category.findById(categoryId)

        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "Category Not Found!!"
            })
        }

        //  Find all questions related to the category
        const relatedSubcategories = await Subcategory.find({ category: categoryId });

        //  Delete questions related to the category
        for (const subcategory of relatedSubcategories) {
            // Delete the image file associated with the question, if applicable
            if (subcategory.image) {
                fs.unlink(subcategory.image, (err) => {
                    if (err) {
                        console.error('Error deleting question image:', err);
                    } else {
                        console.log('Question image deleted successfully:', subcategory.image);
                    }
                });
            }

            const relatedQuestions = await Question.find({ subcategory: subcategory._id })

            for (const question of relatedQuestions) {
                // Delete the question itself
                await Question.findByIdAndDelete(question._id);
            }

            // Delete the SubCategory itself
            await Subcategory.findByIdAndDelete(subcategory._id);
        }

        // Delete the category image, if applicable
        if (category.image) {
            fs.unlink(category.image, (err) => {
                if (err) {
                    console.error('Error deleting category image:', err);
                } else {
                    console.log('Category image deleted successfully:', category.image);
                }
            });
        }

        const deletecategorie = await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            msg: "Categorie Deleted Successfully..."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error
        })
    }
}


//  ****************************
//  ***** Not Used Code ***********
//  ******************************

// Get All Categories
// module.exports.getAllCategory = async (req, res) => {
//     try {
//         // const categories = await Category.find({category:req.query.category})
//         if (req.query.category == "all") {
//             const categories = await Category.find()

//             const count = await Category.countDocuments();

//             if (categories.length === 0) {
//                 return res.send({
//                     categories: []
//                 })
//             }

//             const modifiedCategories = [];


//             for (const category of categories) {
//                 // Fetch subcategories related to this category
//                 const subcategories = await Subcategory.find({ category: category._id });

//                 modifiedCategories.push({
//                     _id: category._id,
//                     category_name: category.category,
//                     description: category.description,
//                     image: category.image,
//                     createdAt: category.createdAt,
//                     updatedAt: category.updatedAt,
//                     __v: category.__v,
//                     subCategory: subcategories // Include subcategories related to this category
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 Total: count,
//                 count: categories.length,
//                 categories: modifiedCategories
//             })

//         }

//         const categories = await Category.find()
//         const count = await Category.countDocuments();
//         const modifiedCategories = [];

//         for (const category of categories) {
//             // Fetch subcategories related to this category
//             const subcategories = await Subcategory.find({ category: category._id });

//             modifiedCategories.push({
//                 _id: category._id,
//                 category_name: category.category,
//                 description: category.description,
//                 image: category.image,
//                 createdAt: category.createdAt,
//                 updatedAt: category.updatedAt,
//                 __v: category.__v,
//                 subCategory: subcategories // Include subcategories related to this category
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             Total: count,
//             count: categories.length,
//             categories: modifiedCategories
//         });
//     } catch (error) {
//         console.log("error+++", error)
//         return res.status(500).json({
//             success: false,
//             msg: error
//         })
//     }
// }
