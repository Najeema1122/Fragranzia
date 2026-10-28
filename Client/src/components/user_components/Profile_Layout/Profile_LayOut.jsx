import React, { useEffect, useState } from "react";
import UserService from "../../../Services/UserService";
import OrderDetails from "./OrderDetails/OrderDetails";
import './Profile_Layout..css'
import Swal from "sweetalert2";

const Profile_LayOut = () => {

    const {
        addAddress,
        getAddress,
        setPrimaryAddress,
        getOrders,
        getProfile,
        updateProfile,
        returnOrder
    } = UserService();


    // =========================================
    // PAGE STATES
    // =========================================

    const [showForm, setShowForm] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressPage, setShowAddressPage] = useState(false);
    const [showOrders, setShowOrders] = useState(false);


    // =========================================
    // ORDER DETAILS STATES
    // =========================================

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);


    // =========================================
    // ADDRESS TYPE
    // =========================================

    const [selectedType, setSelectedType] = useState("home");


    // =========================================
    // DATA STATES
    // =========================================

    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);

    const [ordersLoading, setOrdersLoading] = useState(false);


    // =========================================
    // PROFILE EDIT STATE
    // =========================================

    const [isEditingProfile, setIsEditingProfile] = useState(false);


    // =========================================
    // PROFILE STATE
    // =========================================

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        dob: "",
        gender: ""
    });


    // =========================================
    // ADDRESS STATE
    // =========================================

    const [address, setAddress] = useState({
        full_name: "",
        phone_number: "",
        address: "",
        district: "",
        state: "",
        landmark: "",
        pincode: "",
        alt_phone_number: ""
    });


    const [addressErrors, setAddressErrors] = useState({});


    // =========================================
    // PROFILE CHANGE
    // =========================================

    const onHandleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };


    // =========================================
    // ADDRESS CHANGE
    // =========================================

    const onHandleAddressChange = (e) => {

        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });


        if (addressErrors[e.target.name]) {

            setAddressErrors((prev) => ({
                ...prev,
                [e.target.name]: ""
            }));

        }

    };


    // =========================================
    // PROFILE EDIT / SAVE
    // =========================================

    const handleEditOrSaveProfile = async (e) => {

        e.preventDefault();


        // First click = enable editing
        if (!isEditingProfile) {

            setIsEditingProfile(true);

            return;
        }


        try {

            const response = await updateProfile(profile);

            console.log("Profile updated:", response);


            if (response?.user) {

                setProfile({
                    full_name: response.user.name || "",
                    email: response.user.email || "",
                    phone_number: response.user.phone || "",
                    dob: response.user.dob || profile.dob || "",
                    gender: response.user.gender || profile.gender || ""
                });

            }


            setIsEditingProfile(false);

           // alert("Profile updated successfully");
            Swal.fire({
                title: "Profile",
                text: "Profile Updated succeddfully",
                icon: "Sucess",
                confirmButtonText: "OK"
            });

        } catch (err) {

            console.log(
                "Profile update error:",
                err.response?.data || err.message
            );

            // alert(
            //     err.response?.data?.message ||
            //     "Failed to update profile"
            // );
            Swal.fire({

                text: err.response?.data?.message || "Failed to update profile",

                confirmButtonText: "OK"
            });

        }

    };


    // =========================================
    // ADDRESS VALIDATION
    // =========================================

    const validateAddress = (data) => {

        const errors = {};


        // Full Name
        if (!data.full_name.trim()) {

            errors.full_name = "Full name is required";

        } else if (
            !/^[a-zA-Z\s]{3,}$/.test(data.full_name.trim())
        ) {

            errors.full_name =
                "Enter a valid name (letters only, min 3 characters)";

        }


        // Phone
        if (!data.phone_number.trim()) {

            errors.phone_number =
                "Phone number is required";

        } else if (
            !/^[6-9]\d{9}$/.test(data.phone_number.trim())
        ) {

            errors.phone_number =
                "Enter a valid 10-digit mobile number";

        }


        // Address
        if (!data.address.trim()) {

            errors.address =
                "Address is required";

        } else if (
            data.address.trim().length < 5
        ) {

            errors.address =
                "Address looks too short";

        }


        // District
        if (!data.district.trim()) {

            errors.district =
                "City/District is required";

        }


        // State
        if (!data.state.trim()) {

            errors.state =
                "State is required";

        }


        // Landmark
        if (!data.landmark.trim()) {

            errors.landmark =
                "Landmark is required";

        }


        // Pincode
        if (!data.pincode.trim()) {

            errors.pincode =
                "PinCode is required";

        } else if (
            !/^\d{6}$/.test(data.pincode.trim())
        ) {

            errors.pincode =
                "Enter a valid 6-digit PIN code";

        }


        // Alternative phone
        if (
            data.alt_phone_number.trim() &&
            !/^[6-9]\d{9}$/.test(
                data.alt_phone_number.trim()
            )
        ) {

            errors.alt_phone_number =
                "Enter a valid 10-digit mobile number";

        }


        return errors;

    };


    // =========================================
    // ADD ADDRESS
    // =========================================

    const onHandleAddressSubmit = async (e) => {

        e.preventDefault();


        const validationErrors =
            validateAddress(address);


        if (
            Object.keys(validationErrors).length > 0
        ) {

            setAddressErrors(validationErrors);

            return;

        }


        try {

            const addressData = {
                ...address,
                type: selectedType
            };


            const res =
                await addAddress(addressData);


            setAddresses((prev) => [
                ...prev,
                res.address
            ]);


            // Reset form
            setAddress({
                full_name: "",
                phone_number: "",
                address: "",
                district: "",
                state: "",
                landmark: "",
                pincode: "",
                alt_phone_number: ""
            });


            setAddressErrors({});

            setShowAddressForm(false);


            // alert("Address added successfully");
            Swal.fire({

                text: "Address Added Successfully",

                confirmButtonText: "OK"
            });

        } catch (err) {

            console.log(
                "Add address error:",
                err.response?.data || err.message
            );

            // alert(
            //     err.response?.data?.message ||
            //     "Failed to add address"
            // );
            Swal.fire({

                text: err.response?.data?.message || "Failed to add address",
                Icon: Fail,
                confirmButtonText: "OK"
            });

        }

    };


    // =========================================
    // SET PRIMARY ADDRESS
    // =========================================

    const handleSetPrimary = async (id) => {

        // Optimistic UI update
        setAddresses((prev) =>
            prev.map((addr) => ({
                ...addr,
                isPrimary: addr._id === id
            }))
        );


        try {

            const primaryRes =
                await setPrimaryAddress(id);

            console.log(
                "PUT primary response:",
                primaryRes
            );


            const res = await getAddress();

            setAddresses(
                res.addresses || []
            );

        } catch (err) {

            console.log(
                "setPrimaryAddress error:",
                err
            );

        }

    };


    // =========================================
    // SHOW PROFILE
    // =========================================

    const handleShowProfile = () => {

        setShowForm(!showForm);

        setShowAddressPage(false);

        setShowOrders(false);

        setShowAddressForm(false);

    };


    // =========================================
    // SHOW ADDRESS
    // =========================================

    const handleShowAddressPage = () => {

        setShowAddressPage(!showAddressPage);

        setShowForm(false);

        setShowOrders(false);

    };


    // =========================================
    // SHOW ORDERS
    // =========================================

    const handleShowOrders = () => {

        setShowOrders(!showOrders);

        setShowForm(false);

        setShowAddressPage(false);

        setShowAddressForm(false);

    };


    // =========================================
    // ORDER STATUS CLASS
    // =========================================

    const getStatusBadgeClass = (status) => {

        switch (status) {

            case "Delivered":

                return "status_badge status_delivered";


            case "Out for Delivery":

                return "status_badge status_out_for_delivery";


            case "Shipped":

                return "status_badge status_shipped";


            case "Processing":

                return "status_badge status_processing";


            case "Cancelled":

                return "status_badge status_cancelled";


            case "Returned":

                return "status_badge status_returned";


            default:

                return "status_badge status_pending";

        }

    };


    // =========================================
    // OPEN ORDER DETAILS
    // =========================================

    const handleShowOrderDetails = (order) => {

        setSelectedOrder(order);

        setShowOrderDetails(true);

    };


    // =========================================
    // CLOSE ORDER DETAILS
    // =========================================

    const handleCloseOrderDetails = () => {

        setShowOrderDetails(false);

        setSelectedOrder(null);

    };


    // =========================================
    // RETURN ORDER
    // =========================================

    const handleReturnOrder = async (order) => {

        try {

            console.log("Returning order:", order);


            const response =
                await returnOrder(order._id);


            console.log(
                "Return response:",
                response
            );


            if (response?.order) {

                // =========================================
                // UPDATE ORDER LIST IMMEDIATELY
                // =========================================

                setOrders((prevOrders) =>
                    prevOrders.map((item) =>
                        item._id === response.order._id
                            ? response.order
                            : item
                    )
                );


                // =========================================
                // UPDATE OPEN ORDER DETAILS
                // =========================================

                setSelectedOrder(
                    response.order
                );

            }


            // alert(
            //     response?.message ||
            //     "Return request submitted successfully"
            // );
            Swal.fire({

               text: response?.message || "Return request submitted successfully",

                confirmButtonText: "OK"
            });


        return response;

    } catch (err) {

        console.log(
            "Return order error:",
            err.response?.data ||
            err.message
        );


        // alert(
        //     err.response?.data?.message ||
        //     "Failed to return order"
        // );
        Swal.fire ({
            text:err.response?.data?.message ||  "Failed to return order",
            confirmButtonText: "OK"
        })


        throw err;

    }

};
// =========================================
// CANCEL ORDER - UPDATE CARD IMMEDIATELY
// =========================================

const handleOrderCancelled = (cancelledOrder) => {

    if (!cancelledOrder) return;

    // Update the order card immediately
    setOrders((prevOrders) =>
        prevOrders.map((item) =>
            item._id === cancelledOrder._id
                ? cancelledOrder
                : item
        )
    );

    // Update the currently opened order details
    setSelectedOrder(cancelledOrder);
};


// =========================================
// GET PROFILE
// =========================================

useEffect(() => {

    const fetchProfile = async () => {

        try {

            const response =
                await getProfile();


            if (response?.user) {

                setProfile({
                    full_name:
                        response.user.name || "",

                    email:
                        response.user.email || "",

                    phone_number:
                        response.user.phone || "",

                    dob:
                        response.user.dob || "",

                    gender:
                        response.user.gender || ""
                });

            }

        } catch (err) {

            console.log(
                "Get profile error:",
                err.response?.data ||
                err.message
            );

        }

    };


    fetchProfile();

}, []);


// =========================================
// GET ADDRESSES
// =========================================

useEffect(() => {

    const fetchAddress = async () => {

        try {

            const res =
                await getAddress();


            setAddresses(
                res.addresses || []
            );

        } catch (err) {

            console.log(
                "Get address error:",
                err
            );

        }

    };


    fetchAddress();

}, []);


// =========================================
// GET ORDERS
// =========================================

useEffect(() => {

    if (!showOrders) return;


    const fetchOrders = async () => {

        try {

            setOrdersLoading(true);


            const res =
                await getOrders();


            setOrders(
                res.orders || []
            );

        } catch (err) {

            console.log(
                "getOrders error:",
                err
            );

        } finally {

            setOrdersLoading(false);

        }

    };


    fetchOrders();

}, [showOrders]);


return (

    <div className="Profile_container">

        {/* =====================================
                PAGE TITLE
            ===================================== */}

        <h1>Profile</h1>


        {/* =====================================
                PROFILE TABS
            ===================================== */}

        <div>

            <div className="profile_tabs">

                <button
                    type="button"
                    className={`profile_tab_btn ${showForm ? "active" : ""
                        }`}
                    onClick={handleShowProfile}
                >
                    Profile
                </button>


                <button
                    type="button"
                    className={`profile_tab_btn ${showAddressPage ? "active" : ""
                        }`}
                    onClick={handleShowAddressPage}
                >
                    Address
                </button>


                <button
                    type="button"
                    className={`profile_tab_btn ${showOrders ? "active" : ""
                        }`}
                    onClick={handleShowOrders}
                >
                    My Order
                </button>


                {showAddressPage && (

                    <button
                        type="button"
                        className="add_address_btn"
                        onClick={() =>
                            setShowAddressForm(
                                !showAddressForm
                            )
                        }
                    >
                        Add Address
                    </button>

                )}

            </div>


            {/* =====================================
                    PROFILE FORM
                ===================================== */}

            {showForm && (

                <div className="Profile_Add_form">

                    <form
                        onSubmit={
                            handleEditOrSaveProfile
                        }
                    >

                        <div className="profile_form_group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={
                                    profile.full_name
                                }
                                onChange={
                                    onHandleChange
                                }
                                disabled={
                                    !isEditingProfile
                                }
                            />

                        </div>


                        <div className="profile_form_group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    profile.email
                                }
                                onChange={
                                    onHandleChange
                                }
                                disabled
                            />

                        </div>


                        <div className="profile_form_group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone_number"
                                value={
                                    profile.phone_number
                                }
                                onChange={
                                    onHandleChange
                                }
                                disabled={
                                    !isEditingProfile
                                }
                            />

                        </div>


                        <div className="profile_form_group">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dob"
                                value={
                                    profile.dob
                                }
                                onChange={
                                    onHandleChange
                                }
                                disabled={
                                    !isEditingProfile
                                }
                            />

                        </div>


                        <div className="profile_form_group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={
                                    profile.gender
                                }
                                onChange={
                                    onHandleChange
                                }
                                disabled={
                                    !isEditingProfile
                                }
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            className="profile_save_btn"
                        >
                            {isEditingProfile
                                ? "Save Changes"
                                : "Edit Profile"}
                        </button>

                    </form>

                </div>

            )}

        </div>


        {/* =====================================
                ADDRESS PAGE
            ===================================== */}

        {showAddressPage && (

            <div className="address_list">

                {addresses.length === 0 ? (

                    <p className="no_address">
                        No addresses added yet.
                    </p>

                ) : (

                    addresses.map((item) => (

                        <div
                            key={item._id}
                            className="address_card"
                        >

                            <div className="address_card_header">

                                <h4>
                                    {item.type ||
                                        "Address"}
                                </h4>

                                {item.isPrimary && (

                                    <span className="primary_badge">
                                        Primary
                                    </span>

                                )}

                            </div>


                            <p>
                                {item.full_name}
                            </p>

                            <p>
                                {item.phone_number}
                            </p>

                            <p>
                                {item.address}
                            </p>

                            <p>
                                {item.district},{" "}
                                {item.state}
                            </p>

                            <p>
                                {item.landmark}
                            </p>

                            <p>
                                {item.pincode}
                            </p>


                            <div className="isPrimary">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleSetPrimary(
                                            item._id
                                        )
                                    }
                                    disabled={
                                        item.isPrimary
                                    }
                                >
                                    {item.isPrimary
                                        ? "Default"
                                        : "Set as Primary"}
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        )}


        {/* =====================================
                ORDERS
            ===================================== */}

        {showOrders && (

            <div className="Orders_container">

                {/* Loading */}

                {ordersLoading && (

                    <p>
                        Loading your orders...
                    </p>

                )}


                {/* Empty */}

                {!ordersLoading &&
                    orders.length === 0 && (

                        <p>
                            You haven't placed any
                            orders yet.
                        </p>

                    )}


                {/* Order Cards */}

                {!ordersLoading &&
                    orders.length > 0 &&
                    orders.map((order) => (

                        <div
                            key={order._id}
                            className="order_card"
                        >

                            {/* ORDER HEADER */}

                            <div className="order_card_header">

                                <span className="order_id">

                                    Order ID: #

                                    {order._id
                                        ?.slice(-8)
                                        .toUpperCase()}

                                </span>


                                <span
                                    className={getStatusBadgeClass(
                                        order.deliveryStatus
                                    )}
                                >
                                    {
                                        order.deliveryStatus
                                    }
                                </span>

                            </div>


                            {/* ORDER ITEMS */}

                            {order.orderItems?.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="order_item"
                                    >

                                        <img src={item.product.image} alt={item.product_name}
                                            className="order_item_image" />


                                        <div className="order_item_details">

                                            <p className="order_item_name">

                                                {
                                                    item
                                                        .product
                                                        ?.product_name
                                                }

                                            </p>


                                            <p className="order_item_qty">

                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )}


                            {/* ORDER FOOTER */}

                            <div className="order_card_footer">

                                <span className="order_total">

                                    ₹
                                    {
                                        order.totalPrice
                                    }

                                </span>


                                <button
                                    type="button"
                                    className="order_details_btn"
                                    onClick={() =>
                                        handleShowOrderDetails(
                                            order
                                        )
                                    }
                                >
                                    Details
                                </button>

                            </div>

                        </div>

                    ))}

            </div>

        )}


        {/* =====================================
                ADD ADDRESS MODAL
            ===================================== */}

        {showAddressForm && (

            <div
                className="address_modal_overlay"
                onClick={() =>
                    setShowAddressForm(false)
                }
            >

                <div
                    className="address_modal"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >

                    {/* MODAL HEADER */}

                    <div className="address_modal_header">

                        <h2>
                            Add New Address
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setShowAddressForm(
                                    false
                                )
                            }
                        >
                            ×
                        </button>

                    </div>


                    {/* ADDRESS FORM */}

                    <form
                        onSubmit={
                            onHandleAddressSubmit
                        }
                    >

                        {/* ADDRESS TYPE */}

                        <div className="address_type_section">

                            <label>
                                Address Type
                            </label>


                            <div className="address_type_buttons">

                                <button
                                    type="button"
                                    className={
                                        selectedType ===
                                            "home"
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSelectedType(
                                            "home"
                                        )
                                    }
                                >
                                    Home
                                </button>


                                <button
                                    type="button"
                                    className={
                                        selectedType ===
                                            "work"
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSelectedType(
                                            "work"
                                        )
                                    }
                                >
                                    Work
                                </button>

                            </div>

                        </div>


                        {/* FULL NAME */}

                        <div className="address_form_group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={
                                    address.full_name
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter full name"
                            />

                            {addressErrors.full_name && (

                                <small>
                                    {
                                        addressErrors.full_name
                                    }
                                </small>

                            )}

                        </div>


                        {/* PHONE */}

                        <div className="address_form_group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone_number"
                                value={
                                    address.phone_number
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter phone number"
                            />

                            {addressErrors.phone_number && (

                                <small>
                                    {
                                        addressErrors.phone_number
                                    }
                                </small>

                            )}

                        </div>


                        {/* ADDRESS */}

                        <div className="address_form_group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={
                                    address.address
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="House / Street / Area"
                                rows="3"
                            />

                            {addressErrors.address && (

                                <small>
                                    {
                                        addressErrors.address
                                    }
                                </small>

                            )}

                        </div>


                        {/* DISTRICT */}

                        <div className="address_form_group">

                            <label>
                                City / District
                            </label>

                            <input
                                type="text"
                                name="district"
                                value={
                                    address.district
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter city or district"
                            />

                            {addressErrors.district && (

                                <small>
                                    {
                                        addressErrors.district
                                    }
                                </small>

                            )}

                        </div>


                        {/* STATE */}

                        <div className="address_form_group">

                            <label>
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={
                                    address.state
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter state"
                            />

                            {addressErrors.state && (

                                <small>
                                    {
                                        addressErrors.state
                                    }
                                </small>

                            )}

                        </div>


                        {/* LANDMARK */}

                        <div className="address_form_group">

                            <label>
                                Landmark
                            </label>

                            <input
                                type="text"
                                name="landmark"
                                value={
                                    address.landmark
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter nearby landmark"
                            />

                            {addressErrors.landmark && (

                                <small>
                                    {
                                        addressErrors.landmark
                                    }
                                </small>

                            )}

                        </div>


                        {/* PINCODE */}

                        <div className="address_form_group">

                            <label>
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={
                                    address.pincode
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter 6-digit pincode"
                            />

                            {addressErrors.pincode && (

                                <small>
                                    {
                                        addressErrors.pincode
                                    }
                                </small>

                            )}

                        </div>


                        {/* ALTERNATIVE PHONE */}

                        <div className="address_form_group">

                            <label>
                                Alternative Phone
                                <span>
                                    {" "}
                                    (Optional)
                                </span>
                            </label>

                            <input
                                type="text"
                                name="alt_phone_number"
                                value={
                                    address.alt_phone_number
                                }
                                onChange={
                                    onHandleAddressChange
                                }
                                placeholder="Enter alternative number"
                            />

                            {addressErrors.alt_phone_number && (

                                <small>
                                    {
                                        addressErrors.alt_phone_number
                                    }
                                </small>

                            )}

                        </div>


                        {/* SUBMIT */}

                        <div className="address_modal_footer">

                            <button
                                type="button"
                                className="cancel_address_btn"
                                onClick={() =>
                                    setShowAddressForm(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save_address_btn"
                            >
                                Save Address
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        )}


        {/* =====================================
                ORDER DETAILS COMPONENT
            ===================================== */}

        {showOrderDetails &&
            selectedOrder && (

                <OrderDetails
                    order={selectedOrder}

                    onClose={
                        handleCloseOrderDetails
                    }

                    onReturn={
                        handleReturnOrder
                    }

                    onOrderCancelled={
                        handleOrderCancelled
                    }
                />

            )}

    </div>

);

};

export default Profile_LayOut;