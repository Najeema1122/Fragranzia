const { Order } = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const getDashboardStats = async (req, res) => {

    try {

        const orders = await Order.find({})
            .populate({
                path: "orderItems.product",
                select: "product_name product_category",
                populate: {
                    path: "product_category",
                    select: "category_name"
                }
            })
            .sort({ createdAt: -1 });

        const totalOrders = orders.length;

        const totalSales = orders.reduce((sum, order) => {
            const isVoided =
                order.deliveryStatus === "Cancelled" ||
                order.deliveryStatus === "Returned";

            return isVoided ? sum : sum + (order.totalPrice || 0);
        }, 0);

        const productsCount = await Product.countDocuments();
        const customersCount = await User.countDocuments({ role: "user" });

        // =========================================
        // 4. WEEKLY ORDERS OVERVIEW (last 7 days)
        // =========================================
        // FIX: use UTC everywhere so bucket keys match order.createdAt's
        // UTC-based toISOString() key. Previously setHours() zeroed the
        // clock in the SERVER'S LOCAL timezone, which shifted the date
        // once .toISOString() converted it back to UTC — causing "today"
        // to be silently miscounted.

        const dayKeys = [];
        const dayCounts = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setUTCHours(0, 0, 0, 0);
            d.setUTCDate(d.getUTCDate() - i);

            const key = d.toISOString().split("T")[0];
            dayKeys.push(key);
            dayCounts[key] = 0;
        }

        orders.forEach(order => {
            const key = order.createdAt.toISOString().split("T")[0];
            if (dayCounts[key] !== undefined) {
                dayCounts[key] += 1;
            }
        });

        const weeklyOrders = dayKeys.map(date => ({
            date,
            orders: dayCounts[date]
        }));

        // =========================================
        // 5. SALES BY CATEGORY
        // =========================================

        const categoryTotals = {};

        orders.forEach(order => {
            const isVoided =
                order.deliveryStatus === "Cancelled" ||
                order.deliveryStatus === "Returned";

            if (isVoided || !order.orderItems.length) return;

            const perItemValue = order.totalPrice / order.orderItems.length;

            order.orderItems.forEach(item => {
                const categoryName =
                    item.product?.product_category?.category_name || "Uncategorized";

                categoryTotals[categoryName] =
                    (categoryTotals[categoryName] || 0) + perItemValue;
            });
        });

        const salesByCategory = Object.entries(categoryTotals).map(
            ([name, value]) => ({
                name,
                value: Math.round(value)
            })
        );

        return res.status(200).json({
            success: true,
            stats: {
                totalSales,
                totalOrders,
                productsCount,
                customersCount,
                weeklyOrders,
                salesByCategory
            }
        });

    } catch (error) {

        console.error("Dashboard Stats Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: error.message
        });

    }

};

module.exports = { getDashboardStats };