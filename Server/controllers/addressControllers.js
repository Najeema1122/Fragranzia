const Address = require("../models/Address");
const User = require("../models/User");

const addToAddress = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            full_name,
            phone_number,
            address,
            district,
            state,
            landmark,
            pincode,
            type,
        } = req.body;

        const newAddress = new Address({
            user: userId,
            full_name,
            phone_number,
            address,
            district,
            state,
            landmark,
            pincode,
            type,
            isPrimary: false,
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            address: savedAddress,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getAddress = async (req, res) => {
    try {
        const userId = req.userId;

        const addresses = await Address.find({ user: userId });

        res.status(200).json({
            success: true,
            addresses,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const setPrimaryAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;
        console.log("setprimaryaddress======", req.userId,req.params)

        // Remove primary from all addresses of this user
        await Address.updateMany(
            { user: userId },
            { $set: { isPrimary: false } }
        );

        // Set selected address as primary
        const address = await Address.findOneAndUpdate(
            {
                _id: addressId,
                user: userId,
            },
            {
                $set: { isPrimary: true },
            },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Primary address updated",
            address,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



module.exports = {
    addToAddress,
    getAddress,
    setPrimaryAddress
};