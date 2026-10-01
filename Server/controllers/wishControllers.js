const User = require("../models/User");
const Product = require("../models/Product")

const addToWishList = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(req.body);



        // Logged-in user id from checkAuth middleware
        const userId = req.userId;


        //check if the product exist
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(400).json({
                message: "product not found",
                success: false
            })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false,
            })
        };

        // check if product is already in the wish list

        const existingProduct = user.wishlist.find(
            (item) => item.product.toString() === productId
        );

        if (existingProduct) {
            return res.status(400).json({
                message: "item already in the wish list",
                success: false
            })
        }
        else {
            user.wishlist.push({
                product: productId
            })
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "product Added to wishlist",
            wishlist: user.wishlist,
        })

    } catch (error) {
        console.log(error.response?.data);
        console.log(error.response?.status);
    

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
};


const getWishList = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate("wishlist.product");

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteWishList = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log("Product ID from params:", productId);

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.wishlist = user.wishlist.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    addToWishList,
    getWishList,
    deleteWishList
}