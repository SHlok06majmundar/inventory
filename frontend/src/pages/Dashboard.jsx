import React, { useState, useEffect } from 'react';
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
    Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate(); // Initialize navigate
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        quantity: 0,
        category: '',
        purchaseDate: '',
        serialNumber: '',
        image: null,
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [categories] = useState(['Electronics', 'Furniture', 'Clothing']);
    
    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage('Error fetching products: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        if (!newProduct.name || newProduct.price <= 0 || newProduct.quantity <= 0) {
            setError('Name, price, and quantity are required fields with valid values.');
            return;
        }

        setError('');

        const formData = new FormData();
        Object.entries(newProduct).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage('Product added successfully');
            fetchProducts();
            setNewProduct({ name: '', price: 0, quantity: 0, category: '', purchaseDate: '', serialNumber: '', image: null });
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Error adding product: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct?._id) {
            setMessage('No product selected for editing.');
            return;
        }

        if (!newProduct.name || newProduct.price <= 0 || newProduct.quantity <= 0) {
            setError('Name, price, and quantity are required fields with valid values.');
            return;
        }

        setError('');

        const formData = new FormData();
        Object.entries(newProduct).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessage('Product updated successfully');
            fetchProducts();
            setNewProduct({ name: '', price: 0, quantity: 0, category: '', purchaseDate: '', serialNumber: '', image: null });
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage('Error updating product: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEditProduct = (product) => {
        setNewProduct({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            purchaseDate: product.purchaseDate,
            serialNumber: product.serialNumber,
            image: null,
        });
        setEditingProduct(product);
        setSelectedProduct(product._id);
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${selectedProduct}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setProducts(products.filter(product => product._id !== selectedProduct));
            setOpenDeleteDialog(false);
            setMessage('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            setMessage('Error deleting product: ' + (error.response?.data?.message || error.message));
        }
    };

    // Function to get image preview URL
    const getImagePreview = (file) => {
        return file ? URL.createObjectURL(file) : null;
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
                {error && <Alert severity="error">{error}</Alert>}
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-select-label">Item Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Purchase Date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="date"
                            value={newProduct.purchaseDate}
                            onChange={(e) => setNewProduct({ ...newProduct, purchaseDate: e.target.value })}
                        />
                        <TextField
                            label="Serial Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newProduct.serialNumber}
                            onChange={(e) => setNewProduct({ ...newProduct, serialNumber: e.target.value })}
                        />
                        <input
                            type="file"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                        />
                        
                        {/* Display the uploaded image as an avatar */}
                        {newProduct.image && (
                            <Avatar
                                alt={newProduct.name}
                                src={getImagePreview(newProduct.image)}
                                sx={{ width: 56, height: 56, marginTop: 2 }}
                            />
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                            sx={{ marginTop: 2 }}
                        >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    </CardContent>
                </Card>

                <Typography variant="h5" align="center">Products List</Typography>
                {products.map((product) => (
                    <Card key={product._id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography>Price: {product.price}</Typography>
                            <Typography>Quantity: {product.quantity}</Typography>
                            <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                            <Button onClick={() => { setSelectedProduct(product._id); setOpenDeleteDialog(true); }}>Delete</Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Button to redirect to Maintenance Management */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/maintenance-management')}
                    sx={{ marginTop: 2 }}
                >
                    Go to Maintenance Management
                </Button>
            </Box>

            {/* Confirmation Dialog for Deleting a Product */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
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
    );
}

export default Dashboard;
