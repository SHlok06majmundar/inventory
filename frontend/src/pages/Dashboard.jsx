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
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function Dashboard() {
    const navigate = useNavigate();
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
            resetForm();
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
            resetForm();
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

    const resetForm = () => {
        setNewProduct({ name: '', price: 0, quantity: 0, category: '', purchaseDate: '', serialNumber: '', image: null });
        setError('');
        setMessage('');
    };

    const getImagePreview = (file) => {
        return file ? URL.createObjectURL(file) : null;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleGoToMaintenance = () => {
        navigate('/maintenance-management'); // Adjust this path as necessary
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: '#f0f2f5',
                padding: 4,
            }}
        >
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'primary.main',
                }}
                onClick={handleLogout}
            >
                <LogoutIcon />
            </IconButton>
            <Box sx={{ maxWidth: '600px', width: '100%', padding: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>Product Dashboard</Typography>
                {message && <Alert severity="info">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Card sx={{ marginBottom: 3 }}>
                    <CardContent>
                        <Typography variant="h6" align="center">Add / Update Product</Typography>
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
                            style={{ margin: '16px 0' }}
                        />
                        {newProduct.image && (
                            <Avatar
                                alt={newProduct.name}
                                src={getImagePreview(newProduct.image)}
                                sx={{ width: 56, height: 56, marginTop: 2, marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                            />
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleAddProduct}>
                                Add Product
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleUpdateProduct}>
                                Update Product
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Button variant="outlined" color="primary" onClick={handleGoToMaintenance} sx={{ marginTop: 2, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
                    Go to Maintenance Management
                </Button>

                <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>Product List</Typography>
                {products.map((product) => (
                    <Card key={product._id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="body1">{product.name}</Typography>
                            <Typography variant="body2">Price: {product.price}</Typography>
                            <Typography variant="body2">Quantity: {product.quantity}</Typography>
                            <Typography variant="body2">Category: {product.category}</Typography>
                            <Typography variant="body2">Purchase Date: {product.purchaseDate}</Typography>
                            <Typography variant="body2">Serial Number: {product.serialNumber}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                                <Button onClick={() => handleEditProduct(product)} variant="outlined" color="primary">
                                    Edit
                                </Button>
                                <Button onClick={() => { setSelectedProduct(product._id); setOpenDeleteDialog(true); }} variant="outlined" color="error">
                                    Delete
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}

                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this product?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteProduct} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default Dashboard;
