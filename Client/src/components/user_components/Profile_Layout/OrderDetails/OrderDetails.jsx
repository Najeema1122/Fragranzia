
import React, { useState } from "react";
import "./OrderDetails.css";
import UserService from "../../../../Services/UserService";

const OrderDetails = ({
    order,
    onClose,
    onReturn,
    onOrderCancelled
}) => {
    const { cancelOrder } = UserService();

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    // Return states
    const [isReturning, setIsReturning] = useState(false);
    const [returnError, setReturnError] = useState(null);

    // Local delivery status so UI updates immediately
    // after cancel or return.
    const [localDeliveryStatus, setLocalDeliveryStatus] = useState(
        order?.deliveryStatus
    );

    if (!order) return null;

    const currentDeliveryStatus =
        localDeliveryStatus ?? order.deliveryStatus;

    const isDelivered = currentDeliveryStatus === "Delivered";
    const isCancelled = currentDeliveryStatus === "Cancelled";
    const isReturned = currentDeliveryStatus === "Returned";

    const subtotal =
        order.orderItems?.reduce((total, item) => {
            const price =
                item.product?.sales_price ||
                item.product?.price ||
                0;

            return total + Number(price) * item.quantity;
        }, 0) || 0;

    const shipping = 0;

    // =========================================
    // CANCEL ORDER
    // =========================================

    const handleCancelClick = () => {
        setCancelError(null);
        setShowCancelConfirm(true);
    };

    const handleConfirmCancel = async () => {
        setIsCancelling(true);
        setCancelError(null);

        try {
            const data = await cancelOrder(order._id);

            // Update modal immediately
            setLocalDeliveryStatus(
                data.order?.deliveryStatus || "Cancelled"
            );

            setShowCancelConfirm(false);

            // Update parent order list
            onOrderCancelled?.(data.order);

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Something went wrong. Please try again.";

            setCancelError(message);

        } finally {
            setIsCancelling(false);
        }
    };

    const handleDismissConfirm = () => {
        if (isCancelling) return;

        setShowCancelConfirm(false);
        setCancelError(null);
    };

    // =========================================
    // RETURN ORDER
    // =========================================

    const handleReturnOrder = async () => {
        if (isReturning) return;

        setIsReturning(true);
        setReturnError(null);

        try {
            const response = await onReturn?.(order);

            // Update modal immediately
            if (response?.order?.deliveryStatus) {
                setLocalDeliveryStatus(
                    response.order.deliveryStatus
                );
            } else {
                setLocalDeliveryStatus("Returned");
            }

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to return order. Please try again.";

            setReturnError(message);

        } finally {
            setIsReturning(false);
        }
    };

    return (
        <div className="order_details_overlay">

            <div className="order_details_modal">

                {/* ================= HEADER ================= */}

                <div className="order_details_header">

                    <div>

                        <h3>▣ Order Details</h3>

                        <p>
                            #{order._id?.slice(-16).toUpperCase()}
                        </p>

                    </div>

                    <button
                        className="order_details_close_icon"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* ================= MAIN CONTENT ================= */}

                <div className="order_details_content">

                    {/* ================= LEFT SIDE ================= */}

                    <div className="order_details_left">

                        <h5>ITEMS ORDERED</h5>

                        <div className="order_products">

                            {order.orderItems?.map((item, index) => {

                                const product = item.product;

                                const price =
                                    product?.sales_price ||
                                    product?.price ||
                                    0;

                                return (
                                    <div
                                        className="order_product_row"
                                        key={index}
                                    >

                                        <div className="order_product_image_box">

                                            {/* <img
                                                src={`http://localhost:5000/uploads/${product?.image}`}
                                                alt={
                                                    product?.product_name ||
                                                    "Product"
                                                }
                                            /> */}
                                             <img src={item.product.image} alt={item.product_name} />

                                        </div>


                                        <div className="order_product_info">

                                            <h4>
                                                {product?.product_name}
                                            </h4>

                                            <p>
                                                Qty: {item.quantity}
                                            </p>

                                            <span>
                                                Price: ₹
                                                {Number(price).toFixed(2)}
                                            </span>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>


                        {/* ================= PRICE DETAILS ================= */}

                        <div className="order_price_details">

                            <div>
                                <span>Subtotal</span>

                                <span>
                                    ₹
                                    {Number(
                                        order.totalPrice || subtotal
                                    ).toFixed(2)}
                                </span>
                            </div>


                            <div>

                                <span>Shipping</span>

                                <span className="free_shipping">
                                    Free
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ================= RIGHT SIDE ================= */}

                    <div className="order_details_right">

                        {/* ================= SHIPPING ADDRESS ================= */}

                        <div className="details_section">

                            <h5>
                                📍 SHIPPING ADDRESS
                            </h5>

                            <div className="shipping_address">

                                <p>
                                    {order.shippingAddress?.full_name ||
                                        "User"}
                                </p>

                                <p>
                                    {order.shippingAddress?.address || ""}
                                </p>

                                <p>
                                    {order.shippingAddress?.district
                                        ? `${order.shippingAddress.district}, `
                                        : ""}

                                    {order.shippingAddress?.state || ""}
                                </p>

                                <p>
                                    {order.shippingAddress?.country ||
                                        "India"}{" "}
                                    -{" "}
                                    {order.shippingAddress?.pincode || ""}
                                </p>

                                {order.shippingAddress?.phone_number && (
                                    <p className="shipping_phone">
                                        ☎{" "}
                                        {order.shippingAddress.phone_number}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* ================= PAYMENT & DELIVERY ================= */}

                        <div className="details_section">

                            <h5>
                                💳 PAYMENT & DELIVERY
                            </h5>

                            <div className="payment_delivery">

                                <div>

                                    <span>
                                        Payment Method
                                    </span>

                                    <strong>
                                        {order.paymentMethod || "COD"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Payment Status
                                    </span>

                                    <strong
                                        className={`small_status ${
                                            order.paymentStatus === "Paid"
                                                ? "paid"
                                                : "pending"
                                        }`}
                                    >
                                        {order.paymentStatus || "Pending"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Delivery Status
                                    </span>

                                    <strong
                                        className={`small_status delivery_${currentDeliveryStatus
                                            ?.toLowerCase()
                                            .replace(/\s+/g, "_")}`}
                                    >
                                        {currentDeliveryStatus}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="order_details_footer">

                    <div className="order_final_total">

                        <span>Total</span>

                        <strong>
                            ₹
                            {Number(
                                order.totalPrice || subtotal
                            ).toFixed(2)}
                        </strong>

                    </div>


                    <div className="order_details_buttons">

                        {/* =========================================
                            CANCEL / RETURN BUTTON
                        ========================================= */}

                        {!isCancelled && !isReturned && (

                            isDelivered ? (

                                <button
                                    type="button"
                                    className="return_order_btn"
                                    onClick={handleReturnOrder}
                                    disabled={isReturning}
                                >
                                    {isReturning
                                        ? "Returning..."
                                        : "↩ Return Order"}
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    className="cancel_order_btn"
                                    onClick={handleCancelClick}
                                >
                                    ✕ Cancel Order
                                </button>

                            )

                        )}


                        {/* Return error */}

                        {returnError && (
                            <p className="return_error_text">
                                {returnError}
                            </p>
                        )}


                        {/* Close button */}

                        <button
                            type="button"
                            className="close_details_btn"
                            onClick={onClose}
                        >
                            Close Details
                        </button>

                    </div>

                </div>

            </div>


            {/* ================= CANCEL CONFIRM MODAL ================= */}

            {showCancelConfirm && (

                <div className="cancel_confirm_overlay">

                    <div className="cancel_confirm_modal">

                        <h4>
                            Cancel this order?
                        </h4>

                        <p>
                            This will cancel order #
                            {order._id?.slice(-16).toUpperCase()}.
                            This action can't be undone.
                        </p>


                        {cancelError && (

                            <p className="cancel_error_text">
                                {cancelError}
                            </p>

                        )}


                        <div className="cancel_confirm_buttons">

                            <button
                                type="button"
                                className="cancel_confirm_no_btn"
                                onClick={handleDismissConfirm}
                                disabled={isCancelling}
                            >
                                Keep Order
                            </button>


                            <button
                                type="button"
                                className="cancel_confirm_yes_btn"
                                onClick={handleConfirmCancel}
                                disabled={isCancelling}
                            >
                                {isCancelling
                                    ? "Cancelling..."
                                    : "Yes, Cancel"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default OrderDetails;
