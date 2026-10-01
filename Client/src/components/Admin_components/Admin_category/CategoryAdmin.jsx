
import React, { useState, useEffect } from "react";
import "./Category.css";
import AdminService from "../../../Services/AdminService";

const CategoryAdmin = () => {

    const {
        getCategories,
        addCategories,
        putCategory
    } = AdminService();

    // ========================================
    // CATEGORY FORM STATE
    // ========================================

    const [category, setCategory] = useState({
        category_name: "",
        description: "",
        status: false
    });

    // ========================================
    // CATEGORY LIST
    // ========================================

    const [categoryList, setCategoryList] = useState([]);

    // ========================================
    // UI STATES
    // ========================================

    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // ========================================
    // PAGINATION
    // ========================================

    const [currentPage, setCurrentPage] = useState(1);

    const categoriesPerPage = 10;

    const totalPages = Math.ceil(
        categoryList.length / categoriesPerPage
    );

    const indexOfLastCategory =
        currentPage * categoriesPerPage;

    const indexOfFirstCategory =
        indexOfLastCategory - categoriesPerPage;

    const currentCategories = categoryList.slice(
        indexOfFirstCategory,
        indexOfLastCategory
    );

    // ========================================
    // HANDLE INPUT CHANGE
    // ========================================

    const handleChange = (e) => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value
        });
    };

    // ========================================
    // VALIDATION
    // ========================================

    const validate = () => {

        let tempErrors = {};

        if (!category.category_name.trim()) {
            tempErrors.category_name =
                "Category name is required";
        }

        if (!category.description.trim()) {
            tempErrors.description =
                "Description is required";
        }

        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    // ========================================
    // GET CATEGORIES
    // ========================================

    const fetchCategory = async () => {

        try {

            setLoading(true);

            const res = await getCategories();

            setCategoryList(res || []);

        } catch (error) {

            console.log(
                "Failed to fetch categories:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    // ========================================
    // RESET PAGE WHEN REQUIRED
    // ========================================

    useEffect(() => {

        if (
            totalPages > 0 &&
            currentPage > totalPages
        ) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0) {
            setCurrentPage(1);
        }

    }, [categoryList.length, totalPages, currentPage]);

    // ========================================
    // BLOCK / UNBLOCK CATEGORY
    // ========================================

    const onHandleStatus = async (id) => {

        console.log("Category ID:", id);

        try {

            await putCategory(id);

            await fetchCategory();

        } catch (error) {

            console.log(
                "Failed to update category status:",
                error
            );

        }
    };

    // ========================================
    // OPEN ADD CATEGORY POPUP
    // ========================================

    const openCategoryForm = () => {

        setCategory({
            category_name: "",
            description: "",
            status: false
        });

        setErrors({});

        setShowForm(true);
    };

    // ========================================
    // CLOSE ADD CATEGORY POPUP
    // ========================================

    const closeCategoryForm = () => {

        setShowForm(false);

        setErrors({});

        setCategory({
            category_name: "",
            description: "",
            status: false
        });
    };

    // ========================================
    // ADD CATEGORY
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {

            await addCategories(category);

            alert(
                "Category details added successfully"
            );

            await fetchCategory();

            setShowForm(false);

            setCategory({
                category_name: "",
                description: "",
                status: false
            });

            setErrors({});

            // Go to first page
            setCurrentPage(1);

        } catch (error) {

            console.log(
                "Failed to add category:",
                error
            );

        }
    };

    // ========================================
    // PAGINATION FUNCTIONS
    // ========================================

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPreviousPage = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

    };

    const goToNextPage = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }

    };

    // ========================================
    // UI
    // ========================================

    return (
        <div className="admin-container">

            {/* ========================================
                PAGE HEADER
            ======================================== */}

            <div className="category-page-header">

                <h1>Category List</h1>

                <p>
                    Manage product categories and their status
                </p>

            </div>


            {/* ========================================
                ADD CATEGORY BUTTON
            ======================================== */}

            <div className="add-category-section">

                <button
                    type="button"
                    className="add-category-button"
                    onClick={openCategoryForm}
                >
                    Add Category +
                </button>

            </div>


            {/* ========================================
                ADD CATEGORY POPUP
            ======================================== */}

            {showForm && (

                <div
                    className="category-modal-overlay"
                    onClick={closeCategoryForm}
                >

                    <div
                        className="category-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* CLOSE BUTTON */}

                        <button
                            type="button"
                            className="category-close-button"
                            onClick={closeCategoryForm}
                        >
                            ×
                        </button>


                        {/* POPUP TITLE */}

                        <h2>
                            Add Category
                        </h2>


                        {/* ========================================
                            FORM
                        ======================================== */}

                        <form
                            className="category-form"
                            onSubmit={handleSubmit}
                        >

                            {/* CATEGORY NAME */}

                            <div className="form-group">

                                <label htmlFor="category_name">
                                    Category Name
                                </label>

                                <input
                                    id="category_name"
                                    type="text"
                                    name="category_name"
                                    value={
                                        category.category_name
                                    }
                                    placeholder="Enter category name"
                                    onChange={handleChange}
                                />

                                {errors.category_name && (
                                    <p className="error-text">
                                        {
                                            errors.category_name
                                        }
                                    </p>
                                )}

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={
                                        category.description
                                    }
                                    placeholder="Enter category description"
                                    onChange={handleChange}
                                />

                                {errors.description && (
                                    <p className="error-text">
                                        {
                                            errors.description
                                        }
                                    </p>
                                )}

                            </div>


                            {/* SUBMIT BUTTON */}

                            <div className="form-button-container">

                                <button
                                    type="submit"
                                    className="submit-category-button"
                                >
                                    Add Category
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ========================================
                CATEGORY TABLE
            ======================================== */}

            <div className="category-table-container">

                {loading ? (

                    <div className="category-loading">
                        Loading categories...
                    </div>

                ) : categoryList.length === 0 ? (

                    <div className="category-empty">
                        No categories found
                    </div>

                ) : (

                    <>

                        <table className="category-table">

                            <thead>

                                <tr>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentCategories.map(
                                    (item) => (

                                        <tr key={item._id}>

                                            {/* CATEGORY */}

                                            <td className="category-name">
                                                {
                                                    item.category_name
                                                }
                                            </td>


                                            {/* DESCRIPTION */}

                                            <td className="category-description">
                                                {
                                                    item.description
                                                }
                                            </td>


                                            {/* EDIT */}

                                            <td>

                                                <button
                                                    type="button"
                                                    className="category-edit-button"
                                                >
                                                    Edit
                                                </button>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onHandleStatus(
                                                            item._id
                                                        )
                                                    }
                                                    className={
                                                        item.status
                                                            ? "category-status-button category-unblock-button"
                                                            : "category-status-button category-block-button"
                                                    }
                                                >
                                                    {
                                                        item.status
                                                            ? "Unblock"
                                                            : "Block"
                                                    }
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>


                        {/* ========================================
                            PAGINATION
                        ======================================== */}

                        {totalPages > 1 && (

                            <div className="category-pagination">

                                {/* PREVIOUS */}

                                <button
                                    type="button"
                                    className="pagination-arrow"
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                >
                                    Previous
                                </button>


                                {/* PAGE NUMBERS */}

                                <div className="pagination-pages">

                                    {Array.from(
                                        {
                                            length: totalPages
                                        },
                                        (_, index) => {

                                            const pageNumber =
                                                index + 1;

                                            return (

                                                <button
                                                    type="button"
                                                    key={
                                                        pageNumber
                                                    }
                                                    onClick={() =>
                                                        goToPage(
                                                            pageNumber
                                                        )
                                                    }
                                                    className={
                                                        currentPage ===
                                                        pageNumber
                                                            ? "pagination-page active"
                                                            : "pagination-page"
                                                    }
                                                >
                                                    {
                                                        pageNumber
                                                    }
                                                </button>

                                            );

                                        }
                                    )}

                                </div>


                                {/* NEXT */}

                                <button
                                    type="button"
                                    className="pagination-arrow"
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>
    );
};

export default CategoryAdmin;


