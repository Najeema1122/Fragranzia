import React, { useState, useEffect } from "react";
import "./Product.css";
import { useNavigate } from "react-router-dom";
import AdminService from "../../../Services/AdminService";

const initialProductState = {
   product_name: "",
   product_category: "",
   price: "",
   sales_price: "",
   description: "",
   image: null,
   stock: "",
   status: false,
};

const ProductAdmin = () => {

   const {
      getProduct,
      postProduct,
      updateProduct,
      blockProduct,
      getCategories
   } = AdminService();

   const [products, setProducts] = useState(initialProductState);

   const navigate = useNavigate();

   const [productList, setProductList] = useState([]);
   const [showForm, setShowForm] = useState(false);
   const [errors, setErrors] = useState({});
   const [categories, setCategories] = useState([]);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [showPanel, setShowPanel] = useState(false);
   const [editProduct, setEditProduct] = useState(null);
   const [showEditpanel, setShowEditpanel] = useState(false);

   // changing this key remounts the file input, which clears the chosen file
   const [fileKey, setFileKey] = useState(Date.now());


   // =========================================
   // RESET / CLOSE FORM
   // =========================================

   const resetForm = () => {
      setProducts(initialProductState);
      setErrors({});
      setFileKey(Date.now());
   };

   const closeForm = () => {
      resetForm();
      setShowForm(false);
   };


   // =========================================
   // INPUT HANDLER
   // =========================================

   const handleChange = (e) => {
      setProducts({
         ...products,
         [e.target.name]: e.target.value
      });
   };


   // =========================================
   // SHOW PRODUCT DETAILS
   // =========================================

   const onHandleShow = (product) => {
      setSelectedProduct(product);
      setShowPanel(true);
   };


   // =========================================
   // EDIT PRODUCT
   // =========================================

   const onHandleEdit = (product) => {
      setEditProduct({
         ...product
      });

      setShowEditpanel(true);
   };


   const handleEditChange = (e) => {
      setEditProduct({
         ...editProduct,
         [e.target.name]: e.target.value
      });
   };


   const handleUpdate = async (e) => {
      e.preventDefault();

      try {
         await updateProduct(
            editProduct._id,
            editProduct
         );

         alert("Product updated successfully");

         fetchProduct();

         setShowEditpanel(false);

      } catch (error) {
         console.log(error);
      }
   };


   // =========================================
   // BLOCK / UNBLOCK PRODUCT
   // =========================================

   const onHandleStatus = async (id) => {
      try {

         await blockProduct(id);

         fetchProduct();

      } catch (error) {
         console.log(error);
      }
   };


   // =========================================
   // VALIDATION
   // =========================================

   const validate = () => {

      let tempError = {};

      if (!products.product_name.trim()) {
         tempError.product_name = "product name is required";
      }

      if (!products.product_category.trim()) {
         tempError.product_category = "category name is required";
      }

      if (!products.price.toString().trim()) {
         tempError.price = "price is required";
      }

      if (!products.sales_price.toString().trim()) {
         tempError.sales_price = "sales price is required";
      }

      if (!products.description.trim()) {
         tempError.description = "description is required";
      }

      if (!products.image) {
         tempError.image = "image is required";
      }

      if (!products.stock) {
         tempError.stock = "stock is required";
      }

      setErrors(tempError);

      return Object.keys(tempError).length === 0;
   };


   // =========================================
   // FETCH PRODUCTS
   // =========================================

   const fetchProduct = async () => {

      try {

         const res = await getProduct();

         console.log("product list", res);

         setProductList(res);

      } catch (error) {

         console.log(error);

      }
   };


   // =========================================
   // FETCH CATEGORIES
   // =========================================

   const fetchCategories = async () => {

      try {

         const res = await getCategories();

         console.log("Categories from API:", res);

         setCategories(res);

      } catch (error) {

         console.log(error);

      }
   };


   // =========================================
   // SUBMIT PRODUCT
   // =========================================

   const handleSubmit = async (e) => {

      e.preventDefault();

      if (!validate()) return;

      try {

         const formData = new FormData();

         formData.append("product_name", products.product_name);
         formData.append("product_category", products.product_category);
         formData.append("price", products.price);
         formData.append("sales_price", products.sales_price);
         formData.append("description", products.description);
         formData.append("stock", products.stock);
         formData.append("image", products.image);

         await postProduct(formData);

         alert("Product Added Successfully");

         resetForm();       // clears all fields, errors and the file input

         fetchProduct();

         setShowForm(false);

      } catch (error) {

         console.log(error);

      }
   };


   // =========================================
   // ACTIVE CATEGORIES
   // =========================================

   const activeCategories =
      categories.filter(
         item => item.status === false
      );


   // =========================================
   // INITIAL FETCH
   // =========================================

   useEffect(() => {

      fetchProduct();
      fetchCategories();

   }, []);


   return (
      <>

         <div className="admin_container">

            {/* PAGE HEADER */}

            <div className="product-page-header">

               <h1>Product List</h1>

               <p>
                  Manage products, pricing, stock and
                  their status
               </p>

            </div>


            {/* ADD PRODUCT BUTTON */}

            <div className="add_product_compartment">

               <button
                  type="button"
                  onClick={() => {
                     resetForm();
                     setShowForm(true);
                  }}
               >
                  Add Product+
               </button>

            </div>


            {/* PRODUCT TABLE */}

            <div className="table">

               <table>

                  <thead>

                     <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Sale Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                        <th>Status</th>
                     </tr>

                  </thead>


                  <tbody>

                     {productList.map((item) => (

                        <tr key={item._id}>

                           <td>{item.product_name}</td>

                           <td>{item.product_category?.category_name}</td>

                           <td>{item.price}</td>

                           <td>{item.sales_price}</td>

                           <td>{item.stock}</td>

                           <td>

                              <div>

                                 <button onClick={() => onHandleShow(item)}>
                                    Show
                                 </button>

                                 <button onClick={() => onHandleEdit(item)}>
                                    Edit
                                 </button>

                              </div>

                           </td>

                           <td>

                              <button onClick={() => onHandleStatus(item._id)}>
                                 {item.status ? "Unblock" : "Block"}
                              </button>

                           </td>

                        </tr>

                     ))}

                  </tbody>

               </table>

            </div>

         </div>


         {/* ADD PRODUCT POPUP */}

         {showForm && (

            <div
               className="add_product_modal_overlay"
               onClick={closeForm}
            >

               <div
                  className="add_product_modal"
                  onClick={(e) => e.stopPropagation()}
               >

                  {/* CLOSE */}

                  <button
                     type="button"
                     className="add_product_close_btn"
                     onClick={closeForm}
                  >
                     ×
                  </button>


                  <h2>Add Product</h2>


                  <form onSubmit={handleSubmit}>

                     {/* PRODUCT NAME + CATEGORY */}

                     <div className="input_field_form_style">

                        <div className="admin_input_field">

                           <label>Product name:</label>

                           <input
                              type="text"
                              name="product_name"
                              value={products.product_name}
                              placeholder="Product name"
                              onChange={handleChange}
                           />

                           {errors.product_name && (
                              <p className="error_text">{errors.product_name}</p>
                           )}

                        </div>


                        <div className="admin_input_field">

                           <label>Category:</label>

                           <select
                              name="product_category"
                              value={products.product_category}
                              onChange={handleChange}
                           >

                              <option value="">Select Category</option>

                              {activeCategories.map((item) => (

                                 <option key={item._id} value={item._id}>
                                    {item.category_name}
                                 </option>

                              ))}

                           </select>

                           {errors.product_category && (
                              <p className="error_text">{errors.product_category}</p>
                           )}

                        </div>

                     </div>


                     {/* PRICE + SALE PRICE + STOCK */}

                     <div className="input_field_form_style">

                        <div className="admin_input_field">

                           <label>Price</label>

                           <input
                              type="number"
                              name="price"
                              value={products.price}
                              placeholder="Price"
                              onChange={handleChange}
                           />

                           {errors.price && (
                              <p className="error_text">{errors.price}</p>
                           )}

                        </div>


                        <div className="admin_input_field">

                           <label>Sales Price</label>

                           <input
                              type="number"
                              name="sales_price"
                              value={products.sales_price}
                              placeholder="Sales price"
                              onChange={handleChange}
                           />

                           {errors.sales_price && (
                              <p className="error_text">{errors.sales_price}</p>
                           )}

                        </div>


                        <div className="admin_input_field">

                           <label>Stock</label>

                           <input
                              type="number"
                              name="stock"
                              value={products.stock}
                              placeholder="Enter the stock"
                              onChange={handleChange}
                           />

                           {errors.stock && (
                              <p className="error_text">{errors.stock}</p>
                           )}

                        </div>

                     </div>


                     {/* DESCRIPTION */}

                     <div className="input_field_description">

                        <label>Description</label>

                        <input
                           type="text"
                           name="description"
                           value={products.description}
                           placeholder="Details of the product"
                           onChange={handleChange}
                        />

                        {errors.description && (
                           <p className="error_text">{errors.description}</p>
                        )}

                     </div>


                     {/* IMAGE */}

                     <div>

                        <div className="image_upload_box">

                           <input
                              key={fileKey}
                              type="file"
                              name="image"
                              accept="image/*"
                              onChange={(e) =>
                                 setProducts({
                                    ...products,
                                    image: e.target.files[0]
                                 })
                              }
                           />

                        </div>

                        {errors.image && (
                           <p className="error_text">{errors.image}</p>
                        )}

                     </div>


                     {/* SUBMIT */}

                     <div className="button_container">

                        <button type="submit">
                           Add Product
                        </button>

                     </div>

                  </form>

               </div>

            </div>

         )}


         {/* PRODUCT DETAILS PANEL */}

         {showPanel && selectedProduct && (

            <>

               <div
                  className="modal_overlay"
                  onClick={() => setShowPanel(false)}
               ></div>


               <div className="product_details_panel">

                  <button
                     className="close_btn"
                     onClick={() => setShowPanel(false)}
                  >
                     ×
                  </button>


                  <h2>Product Details</h2>


                  {/* Cloudinary already returns a full, public URL */}
                  <img
                     src={selectedProduct.image}
                     alt={selectedProduct.product_name}
                  />


                  <p>
                     <strong>Name:</strong>
                     {selectedProduct.product_name}
                  </p>

                  <p>
                     <strong>Category:</strong>
                     {selectedProduct.product_category?.category_name}
                  </p>

                  <p>
                     <strong>Price:</strong>
                     ₹{selectedProduct.price}
                  </p>

                  <p>
                     <strong>Sale Price:</strong>
                     ₹{selectedProduct.sales_price}
                  </p>

                  <p>
                     <strong>Stock:</strong>
                     {selectedProduct.stock}
                  </p>

                  <p>
                     <strong>Description:</strong>
                     {selectedProduct.description}
                  </p>

               </div>

            </>

         )}


         {/* EDIT PRODUCT PANEL */}

         {showEditpanel && editProduct && (

            <>

               <div
                  className="modal_overlay"
                  onClick={() => setShowEditpanel(false)}
               ></div>


               <div className="product_details_panel">

                  <button
                     className="close_btn"
                     onClick={() => setShowEditpanel(false)}
                  >
                     ×
                  </button>


                  <h2>Edit Product</h2>


                  <form onSubmit={handleUpdate}>

                     <div className="admin_input_field">

                        <label>Product Name</label>

                        <input
                           type="text"
                           name="product_name"
                           value={editProduct.product_name}
                           onChange={handleEditChange}
                        />

                     </div>


                     <div className="admin_input_field">

                        <label>Category</label>

                        <select
                           name="product_category"
                           value={
                              editProduct.product_category?._id ||
                              editProduct.product_category
                           }
                           onChange={handleEditChange}
                        >

                           {categories.map((item) => (

                              <option key={item._id} value={item._id}>
                                 {item.category_name}
                              </option>

                           ))}

                        </select>

                     </div>


                     <div className="admin_input_field">

                        <label>Price</label>

                        <input
                           type="number"
                           name="price"
                           value={editProduct.price}
                           onChange={handleEditChange}
                        />

                     </div>


                     <div className="admin_input_field">

                        <label>Sale Price</label>

                        <input
                           type="number"
                           name="sales_price"
                           value={editProduct.sales_price}
                           onChange={handleEditChange}
                        />

                     </div>


                     <div className="admin_input_field">

                        <label>Description</label>

                        <textarea
                           name="description"
                           value={editProduct.description}
                           onChange={handleEditChange}
                        />

                     </div>


                     <div className="admin_input_field">

                        <label>Stock</label>

                        <input
                           type="number"
                           name="stock"
                           value={editProduct.stock}
                           onChange={handleEditChange}
                        />

                     </div>


                     <div className="admin_input_field">

                        <label>Current Image</label>

                        <img
                           src={editProduct.image}
                           alt={editProduct.product_name}
                           width="150"
                        />

                     </div>


                     <button type="submit">
                        Update Product
                     </button>

                  </form>

               </div>

            </>

         )}

      </>
   );
};


export default ProductAdmin;