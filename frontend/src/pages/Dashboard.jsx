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
            setMessage('Error adding product: ' + (error.response?.data?.message || error.message));
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

    // Handle product selection from dropdown
    const handleProductSelect = (event) => {
        const productId = event.target.value;
        const product = products.find((p) => p._id === productId);
        if (product) {
            handleEditProduct(product);
            setSelectedProduct(productId);
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/products/${selectedProduct}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Product deleted successfully');
            fetchProducts(); // Refresh the product list
            setOpenDeleteDialog(false); // Close the dialog
            setSelectedProduct(''); // Reset selected product
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage('Error deleting product: ' + (error.response?.data?.message || error.message));
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    // Close delete confirmation dialog
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: '#f0f2f5',
                padding: '0',
                margin: '0',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom align="center" color="#1976d2">
                Dashboard
            </Typography>
            <Card elevation={5} style={{ marginBottom: '20px', width: '100%', maxWidth: '450px' }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom align="center">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2} mb={3}>
                        <TextField
                            label="Product Name"
                            variant="outlined"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            required
                        />
                        <TextField
                            label="Price"
                            variant="outlined"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                            required
                        />
                        <TextField
                            label="Quantity"
                            variant="outlined"
                            type="number"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                        >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                        {message && <Alert severity={message.includes('Error') ? 'error' : 'success'}>{message}</Alert>}
                    </Box>

                    {/* Dropdown for selecting a product */}
                    <FormControl variant="outlined" style={{ minWidth: 200, marginTop: '20px' }}>
                        <InputLabel id="product-select-label">Select Product</InputLabel>
                        <Select
                            labelId="product-select-label"
                            value={selectedProduct}
                            onChange={handleProductSelect}
                            label="Select Product"
                        >
                            {products.map((product) => (
                                <MenuItem key={product._id} value={product._id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Delete Button */}
                    {selectedProduct && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            style={{ marginTop: '20px' }}
                            onClick={handleOpenDeleteDialog}
                        >
                            Delete Product
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog for Deleting Product */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProduct} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Dashboard;
