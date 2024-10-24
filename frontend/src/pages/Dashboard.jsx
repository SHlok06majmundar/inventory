import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, quantity: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Error fetching products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding a new product
  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Product added successfully');
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: '', price: 0, quantity: 0 }); // Reset form
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Error adding product');
    }
  };

  // Handle updating a product
  const handleUpdateProduct = async () => {
    if (!editingProduct?._id) {
      setMessage('No product selected for editing.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setMessage('Product updated successfully');
        fetchProducts(); // Refresh the product list
        setNewProduct({ name: '', price: 0, quantity: 0 }); // Reset form
        setEditingProduct(null); // Reset editing state
      } else {
        setMessage('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle selecting a product for editing
  const handleEditProduct = (product) => {
    setNewProduct({ name: product.name, price: product.price, quantity: product.quantity });
    setEditingProduct(product);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newProduct.quantity}
        onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
      />
      <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
        {editingProduct ? 'Update Product' : 'Add Product'}
      </button>

      {message && <p>{message}</p>}

      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name} - ${product.price.toFixed(2)} - Qty: {product.quantity}
            <button onClick={() => handleEditProduct(product)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
