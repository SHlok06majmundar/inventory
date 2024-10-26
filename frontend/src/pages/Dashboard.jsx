import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, quantity: 0 });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Error fetching products: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle adding a new product
  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setMessage('Product added successfully');
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: '', price: 0, quantity: 0 }); // Reset form
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Error adding product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle updating a product
  const handleUpdateProduct = async () => {
    if (!editingProduct?._id) {
      setMessage('No product selected for editing.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, newProduct);
      setMessage('Product updated successfully');
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: '', price: 0, quantity: 0 }); // Reset form
      setEditingProduct(null); // Reset editing state
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle selecting a product for editing
  const handleEditProduct = (product) => {
    setNewProduct({ name: product.name, price: product.price, quantity: product.quantity });
    setEditingProduct(product);
    setSelectedProduct(product._id);
  };

  // Handle product selection from dropdown
  const handleProductSelect = (event) => {
    const productId = event.target.value;
    const product = products.find((p) => p._id === productId);
    if (product) {
      handleEditProduct(product);
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${selectedProduct}`);
      // Remove the deleted product from state
      setProducts(products.filter(product => product._id !== selectedProduct));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Error deleting product: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        padding: '0',
        margin: '0',
      }}
    >
      <Box sx={{ maxWidth: '500px', width: '100%', padding: 2 }}>
        <Typography variant="h4" align="center">Product Dashboard</Typography>
        {message && <Alert severity="info">{message}</Alert>}
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            />
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
            />
            <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} variant="contained" fullWidth>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </CardContent>
        </Card>
        <FormControl fullWidth margin="normal">
          <InputLabel id="product-select-label">Select Product to Edit</InputLabel>
          <Select
            labelId="product-select-label"
            value={selectedProduct}
            onChange={handleProductSelect}
          >
            {products.map((product) => (
              <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete Selected Product
        </Button>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteProduct} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Dashboard;
