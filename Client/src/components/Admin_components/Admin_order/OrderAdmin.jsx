import React, { useEffect, useState } from "react";
import "./Order.css";
import AdminService from "../../../Services/AdminService";

import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaEye,
  FaCopy,
  FaSyncAlt,
  FaPhone,
  FaEnvelope,
  FaBoxOpen,
  FaTimes
} from "react-icons/fa";


const OrderAdmin = () => {

  const {
    getOrders,
    updateOrderStatus
  } = AdminService();


  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [updatingOrder, setUpdatingOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);


  // =====================================================
  // PAGINATION
  // =====================================================

  const ordersPerPage = 5;

  const totalPages = Math.ceil(
    orders.length / ordersPerPage
  );

  const startIndex =
    (currentPage - 1) * ordersPerPage;

  const currentOrders = orders.slice(
    startIndex,
    startIndex + ordersPerPage
  );


  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await getOrders();

      console.log("Orders response:", response);

      if (response?.success) {

        setOrders(response.orders || []);

      } else {

        setOrders(
          response?.orders || []
        );

        if (!response?.orders) {
          setError(
            response?.message ||
            "Failed to fetch orders"
          );
        }
      }

    } catch (err) {

      console.error(
        "Fetch Orders Error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to fetch orders"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FETCH ON PAGE LOAD
  // =====================================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // =====================================================
  // STATUS LIST
  // =====================================================

  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
    "Failed Delivery"
  ];


  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {

    try {

      setUpdatingOrder(orderId);

      const response =
        await updateOrderStatus(
          orderId,
          newStatus
        );

      console.log(
        "Updated order:",
        response
      );


      if (response?.success) {

        /*
         * Update order in table
         */
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? {
                ...order,
                deliveryStatus:
                  newStatus,
                ...(response.order || {})
              }
              : order
          )
        );


        /*
         * Update selected order
         * inside modal as well
         */
        if (
          selectedOrder &&
          selectedOrder._id === orderId
        ) {

          setSelectedOrder(
            response.order || {
              ...selectedOrder,
              deliveryStatus:
                newStatus
            }
          );
        }

      } else {

        alert(
          response?.message ||
          "Failed to update order status"
        );

      }

    } catch (err) {

      console.error(
        "Update Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to update order status"
      );

    } finally {

      setUpdatingOrder(null);

    }
  };


  // =====================================================
  // OPEN DETAILS
  // =====================================================

  const handleShowDetails = (order) => {

    setSelectedOrder(order);

  };


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const handleCloseDetails = () => {

    setSelectedOrder(null);

  };


  // =====================================================
  // COPY ORDER ID
  // =====================================================

  const handleCopyOrderId = async (
    orderId
  ) => {

    try {

      await navigator.clipboard.writeText(
        orderId
      );

      alert("Order ID copied");

    } catch (error) {

      console.error(
        "Copy error:",
        error
      );

    }
  };


  // =====================================================
  // GET CUSTOMER INITIAL
  // =====================================================

  const getInitial = (name) => {

    if (!name) {
      return "U";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };


  // =====================================================
  // GET PRODUCT PRICE
  // =====================================================

  const getProductPrice = (product) => {

    if (!product) {
      return 0;
    }

    return Number(
      product.sales_price ||
      product.price ||
      0
    );
  };


  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {

    if (!product) {
      return null;
    }

    /*
     * Supports:
     * image
     * images
     * images[0]
     */

    if (product.image) {

      return `http://localhost:5000/uploads/${product.image}`;

    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {

      const image =
        product.images[0];

      if (
        typeof image === "string" &&
        image.startsWith("http")
      ) {

        return image;

      }

      return `http://localhost:5000/uploads/${image}`;

    }

    return null;
  };


  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "status_pending";

      case "Processing":
        return "status_processing";

      case "Shipped":
        return "status_shipped";

      case "Out for Delivery":
        return "status_out";

      case "Delivered":
        return "status_delivered";

      case "Cancelled":
        return "status_cancelled";

      case "Returned":
        return "status_returned";

      case "Failed Delivery":
        return "status_failed";

      default:
        return "status_pending";
    }
  };


  // =====================================================
  // GET PAYMENT STATUS CLASS
  // =====================================================

  const getPaymentStatusClass = (
    status
  ) => {

    switch (status) {

      case "Paid":
        return "paid";

      case "Failed":
        return "failed";

      default:
        return "pending";
    }
  };


  // =====================================================
  // CALCULATE ORDER ITEMS TOTAL
  // =====================================================

  const calculateOrderTotal = (
    order
  ) => {

    if (
      !order ||
      !order.orderItems
    ) {
      return 0;
    }

    return order.orderItems.reduce(
      (total, item) => {

        const price =
          getProductPrice(
            item.product
          );

        return (
          total +
          price *
          Number(
            item.quantity || 0
          )
        );

      },
      0
    );
  };


  // =====================================================
  // RESET PAGE WHEN ORDERS CHANGE
  // =====================================================

  useEffect(() => {

    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {

      setCurrentPage(totalPages);

    }

  }, [
    orders.length,
    currentPage,
    totalPages
  ]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="order_admin_container">

        <div className="order_loading">

          Loading orders...

        </div>

      </div>
    );

  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="order_admin_container">


      {/* =================================================
                HEADER
            ================================================= */}

      <div className="order_page_header">

        <div>

          <h1>
            <FaBoxOpen
              className="page_title_icon"
            />

            Order Management
          </h1>

          <p>
            Monitor, track, and update
            customer orders dynamically
          </p>

        </div>


        <button
          className="last_sync"
          onClick={fetchOrders}
        >

          <FaSyncAlt
            className="sync_icon"
          />

          Last sync: Just now

        </button>

      </div>


      {/* =================================================
                ERROR
            ================================================= */}

      {error && (

        <div className="order_error">

          <span>
            {error}
          </span>

          <button
            onClick={fetchOrders}
          >
            Retry
          </button>

        </div>

      )}


      {/* =================================================
                TABLE
            ================================================= */}

      <div className="orders_table_container">

        <table className="orders_table">


          {/* TABLE HEADER */}

          <thead>

            <tr>

              <th>
                ORDER ID
              </th>

              <th>
                CUSTOMER
              </th>

              <th>
                DATE
              </th>

              <th>
                PRODUCT DETAILS
              </th>

              <th>
                ACTIONS
              </th>

              <th>
                STATUS
              </th>

            </tr>

          </thead>


          {/* TABLE BODY */}

          <tbody>

            {currentOrders.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="no_orders"
                >
                  No orders found
                </td>

              </tr>

            ) : (

              currentOrders.map(
                (order) => {

                  const firstItem =
                    order.orderItems?.[0];

                  const product =
                    firstItem?.product;

                  const productPrice =
                    getProductPrice(
                      product
                    );

                  const quantity =
                    Number(
                      firstItem?.quantity ||
                      0
                    );

                  const itemTotal =
                    productPrice *
                    quantity;

                  return (

                    <tr
                      key={
                        order._id
                      }
                    >


                      {/* ORDER ID */}

                      <td>

                        <div className="order_id_cell">

                          <span>

                            #
                            {order._id
                              ?.slice(-8)
                              .toUpperCase()}

                          </span>

                          <button
                            className="copy_order_id"
                            onClick={() =>
                              handleCopyOrderId(
                                order._id
                              )
                            }
                            title="Copy Order ID"
                          >

                            <FaCopy />

                          </button>

                        </div>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="customer_cell">

                          <div className="customer_avatar">

                            {getInitial(
                              order.user?.name
                            )}

                          </div>


                          <div className="customer_info">

                            <div className="customer_name">

                              {
                                order.user
                                  ?.name ||
                                "Unknown User"
                              }

                            </div>

                            <div className="customer_phone">

                              {order.user
                                ?.phone ||
                                "No phone"}

                            </div>

                          </div>

                        </div>

                      </td>


                      {/* DATE */}

                      <td>

                        <div className="date_cell">

                          <FaCalendarAlt
                            className="calendar_icon"
                          />

                          {formatDate(
                            order.createdAt
                          )}

                        </div>

                      </td>


                      {/* PRODUCT */}

                      <td>

                        {product ? (

                          <div className="product_cell">


                            <div className="product_thumb">

                              {getProductImage(
                                product
                              ) ? (

                                <img
                                  src={getProductImage(
                                    product
                                  )}
                                  alt={
                                    product.product_name
                                  }
                                />

                              ) : (

                                <span className="no_product_image">

                                  No Image

                                </span>

                              )}

                            </div>


                            <div className="product_info">

                              <div className="product_name">

                                {
                                  product.product_name ||
                                  "Product"
                                }

                              </div>


                              <div className="product_quantity">

                                Qty:{" "}

                                {quantity}

                                {" "} | Price: ₹

                                {
                                  productPrice
                                }

                              </div>


                              <div className="product_total">

                                Total: ₹
                                {
                                  itemTotal
                                }

                              </div>

                            </div>

                          </div>

                        ) : (

                          <span>
                            Product unavailable
                          </span>

                        )}

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="show_details_btn"
                          onClick={() =>
                            handleShowDetails(
                              order
                            )
                          }
                        >

                          <FaEye />

                          Show Details

                        </button>

                      </td>


                      {/* STATUS */}

                      <td>

                        <select
                          className={`order_status_select ${getStatusClass(
                            order.deliveryStatus
                          )}`}
                          value={
                            order.deliveryStatus ||
                            "Pending"
                          }
                          disabled={
                            updatingOrder ===
                            order._id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                        >

                          {statuses.map(
                            (status) => (

                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {
                                  status
                                }
                              </option>

                            )
                          )}

                        </select>

                      </td>

                    </tr>

                  );

                }
              )

            )}

          </tbody>

        </table>


        {/* =================================================
                    PAGINATION
                ================================================= */}

        {orders.length > 0 && (

          <div className="pagination">


            {/* PREVIOUS */}

            <button
              className="pagination_btn"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >

              Previous

            </button>


            {/* PAGE NUMBERS */}

            <div className="pagination_numbers">

              {Array.from(
                {
                  length: totalPages
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    className={`page_number ${currentPage ===
                        page
                        ? "active_page"
                        : ""
                      }`}
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                  >

                    {page}

                  </button>

                )
              )}

            </div>


            {/* NEXT */}

            <button
              className="pagination_btn"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >

              Next

            </button>

          </div>

        )}

      </div>


      {/* =================================================
                ORDER DETAILS MODAL
            ================================================= */}

      {selectedOrder && (

        <div
          className="order_details_overlay"
          onClick={handleCloseDetails}
        >

          <div
            className="order_details_modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* =================================================
                            MODAL HEADER
                        ================================================= */}

            <div className="details_header">

              <div className="details_order_id">

                #
                {selectedOrder._id
                  ?.toUpperCase()}

              </div>


              <button
                className="details_close_top"
                onClick={
                  handleCloseDetails
                }
              >

                <FaTimes />

              </button>

            </div>


            {/* =================================================
                            INFORMATION CARDS
                        ================================================= */}

            <div className="details_cards">


              {/* CUSTOMER DETAILS */}

              <div className="details_card">

                <div className="details_card_title">

                  <FaUser
                    className="details_icon"
                  />

                  CUSTOMER DETAILS

                </div>


                <div className="customer_profile">

                  <div className="details_avatar">

                    {getInitial(
                      selectedOrder.user
                        ?.name
                    )}

                  </div>


                  <div>

                    <div className="details_customer_name">

                      {
                        selectedOrder.user
                          ?.name ||
                        "Unknown User"
                      }

                    </div>

                    <div className="details_user_id">

                      User ID:{" "}

                      {selectedOrder.user
                        ?._id ||
                        "N/A"}

                    </div>

                  </div>

                </div>


                <div className="details_contact">

                  <div>

                    <FaPhone />

                    <span>

                      {
                        selectedOrder.user
                          ?.phone ||
                        "No phone available"
                      }

                    </span>

                  </div>


                  <div>

                    <FaEnvelope />

                    <span>

                      {
                        selectedOrder.user
                          ?.email ||
                        "No email available"
                      }

                    </span>

                  </div>

                </div>

              </div>


              {/* SHIPPING ADDRESS */}

              <div className="details_card">

                <div className="details_card_title">

                  <FaMapMarkerAlt
                    className="details_icon"
                  />

                  SHIPPING ADDRESS

                </div>


                <div className="shipping_details_content">

                  <div className="shipping_name">

                    {
                      selectedOrder
                        .shippingAddress
                        ?.full_name ||
                      selectedOrder
                        .shippingAddress
                        ?.fullName ||
                      "Address"
                    }

                  </div>


                  <div className="shipping_text">

                    {
                      selectedOrder
                        .shippingAddress
                        ?.address ||
                      "No address"
                    }

                  </div>


                  <div className="shipping_text">

                    {
                      selectedOrder
                        .shippingAddress
                        ?.district ||
                      selectedOrder
                        .shippingAddress
                        ?.city ||
                      ""
                    }

                    {", "}

                    {
                      selectedOrder
                        .shippingAddress
                        ?.state ||
                      ""
                    }

                  </div>


                  <div className="shipping_text">

                    {
                      selectedOrder
                        .shippingAddress
                        ?.country ||
                      "India"
                    }

                    {" - "}

                    {
                      selectedOrder
                        .shippingAddress
                        ?.pincode ||
                      selectedOrder
                        .shippingAddress
                        ?.zip ||
                      ""
                    }

                  </div>


                  <div className="shipping_phone">

                    <FaPhone />

                    {" "}

                    {
                      selectedOrder
                        .shippingAddress
                        ?.phone_number ||
                      selectedOrder
                        .shippingAddress
                        ?.phone ||
                      selectedOrder.user
                        ?.phone ||
                      "N/A"
                    }

                  </div>

                </div>

              </div>


              {/* ORDER & PAYMENT */}

              <div className="details_card">

                <div className="details_card_title">

                  <FaCreditCard
                    className="details_icon"
                  />

                  ORDER & PAYMENT

                </div>


                <div className="order_payment_content">


                  <div className="payment_row">

                    <span>
                      Order Date
                    </span>

                    <strong>

                      {formatDateTime(
                        selectedOrder.createdAt
                      )}

                    </strong>

                  </div>


                  <div className="payment_row">

                    <span>
                      Payment Status
                    </span>

                    <strong
                      className={`payment_status ${getPaymentStatusClass(
                        selectedOrder.paymentStatus
                      )}`}
                    >

                      {
                        selectedOrder.paymentStatus ||
                        "Pending"
                      }

                    </strong>

                  </div>


                  <div className="payment_row">

                    <span>
                      Payment Method
                    </span>

                    <strong>

                      {
                        selectedOrder.paymentMethod ||
                        "N/A"
                      }

                    </strong>

                  </div>


                  <div className="payment_row">

                    <span>
                      Order Status
                    </span>

                    <strong>

                      {
                        selectedOrder.deliveryStatus ||
                        "Pending"
                      }

                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                            ITEMS ORDERED
                        ================================================= */}

            <div className="items_ordered_section">

              <div className="items_heading">

                ITEMS ORDERED

              </div>


              {selectedOrder.orderItems?.map(
                (item, index) => {

                  const product =
                    item.product;

                  const price =
                    getProductPrice(
                      product
                    );

                  const quantity =
                    Number(
                      item.quantity ||
                      0
                    );

                  const itemTotal =
                    price *
                    quantity;

                  return (

                    <div
                      className="ordered_product"
                      key={
                        item._id ||
                        index
                      }
                    >


                      {/* IMAGE */}

                      <div className="ordered_product_image">

                        {getProductImage(
                          product
                        ) ? (

                          <img
                            src={getProductImage(
                              product
                            )}
                            alt={
                              product?.product_name
                            }
                          />

                        ) : (

                          <span className="product_image_empty">

                            No Image

                          </span>

                        )}

                      </div>


                      {/* PRODUCT INFO */}

                      <div>

                        <div className="ordered_product_name">

                          {
                            product?.product_name ||
                            "Product unavailable"
                          }

                        </div>


                        <div className="ordered_product_meta">

                          <span>

                            Category:{" "}

                            {
                              product?.product_category ||
                              product?.category ||
                              "General"
                            }

                          </span>


                          <span>

                            Qty:{" "}

                            {
                              quantity
                            }

                          </span>

                        </div>

                      </div>


                      {/* PRICE */}

                      <div className="ordered_product_pricing">

                        <div className="pricing_title">

                          PRICING

                        </div>

                        <div className="pricing_value">

                          ₹
                          {price}
                          {" "}×{" "}
                          {quantity}

                        </div>

                      </div>


                      {/* TOTAL */}

                      <div className="ordered_product_total">

                        <div className="pricing_title">

                          TOTAL PRICE

                        </div>

                        <div className="total_price_value">

                          ₹
                          {itemTotal}

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>


            {/* =================================================
                            MODAL FOOTER
                        ================================================= */}

            <div className="details_bottom">


              {/* GRAND TOTAL */}

              <div className="grand_total">

                <div className="grand_total_label">

                  GRAND TOTAL PAID

                </div>

                <div className="grand_total_value">

                  ₹
                  {
                    Number(
                      selectedOrder.totalPrice ??
                      calculateOrderTotal(
                        selectedOrder
                      )
                    )
                  }

                </div>

              </div>


              {/* STATUS */}

              <div className="details_status">

                <label>
                  STATUS:
                </label>


                <select
                  className={`order_status_select ${getStatusClass(
                    selectedOrder.deliveryStatus
                  )}`}
                  value={
                    selectedOrder.deliveryStatus ||
                    "Pending"
                  }
                  disabled={
                    updatingOrder ===
                    selectedOrder._id
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                >

                  {statuses.map(
                    (status) => (

                      <option
                        key={
                          status
                        }
                        value={
                          status
                        }
                      >

                        {
                          status
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* CLOSE */}

              <button
                className="close_details_button"
                onClick={
                  handleCloseDetails
                }
              >

                Close Details

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default OrderAdmin;