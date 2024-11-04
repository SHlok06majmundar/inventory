import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

function MaintenanceManagement() {
  const [products, setProducts] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [dateOfService, setDateOfService] = useState('');
  const [costOfService, setCostOfService] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const serviceTypes = ['Repair', 'Cleaning', 'Maintenance'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://inventory-1jqm.onrender.com/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(res.data);
      } catch (error) {
        handleError('fetching products', error);
      }
    };

    const fetchMaintenanceRecords = async () => {
      try {
        const res = await axios.get('https://inventory-1jqm.onrender.com/api/maintenance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMaintenanceRecords(res.data);
      } catch (error) {
        handleError('fetching maintenance records', error);
      }
    };

    fetchProducts();
    fetchMaintenanceRecords();
  }, []);

  const handleError = (context, error) => {
    console.error(`Error ${context}:`, error);
    setError(`Error ${context}: ${error.response?.data?.message || error.message}`);
  };

  const handleLogOrUpdateMaintenance = async () => {
    if (!selectedProduct || !serviceType || !dateOfService || !costOfService) {
      setMessage('Please fill in all fields.');
      return;
    }

    const maintenanceData = {
      product: selectedProduct,
      serviceType,
      dateOfService,
      costOfService,
    };

    try {
      if (isEditing) {
        await axios.put(`https://inventory-1jqm.onrender.com/api/maintenance/${selectedRecordId}`, maintenanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessage('Maintenance record updated successfully.');
      } else {
        const existingRecord = maintenanceRecords.find(record => record.product._id === selectedProduct);
        if (existingRecord) {
          setMessage('Maintenance record for this product already exists. Edit it instead.');
          return;
        }
        await axios.post('https://inventory-1jqm.onrender.com/api/maintenance', maintenanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessage('Maintenance logged successfully.');
      }

      resetForm();
      await refreshMaintenanceRecords();
    } catch (error) {
      handleError('logging/updating maintenance', error);
    }
  };

  const resetForm = () => {
    setSelectedProduct('');
    setServiceType('');
    setDateOfService('');
    setCostOfService(0);
    setIsEditing(false);
    setError('');
  };

  const refreshMaintenanceRecords = async () => {
    const res = await axios.get('https://inventory-1jqm.onrender.com/api/maintenance', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setMaintenanceRecords(res.data);
  };

  const handleEditMaintenance = (record) => {
    setSelectedRecordId(record._id);
    setSelectedProduct(record.product._id);
    setServiceType(record.serviceType);
    setDateOfService(record.dateOfService.split('T')[0]);
    setCostOfService(record.costOfService);
    setIsEditing(true);
  };

  const handleDeleteMaintenance = async () => {
    try {
      await axios.delete(`https://inventory-1jqm.onrender.com/api/maintenance/${selectedRecordId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOpenDeleteDialog(false);
      setMessage('Maintenance record deleted successfully.');
      await refreshMaintenanceRecords();
    } catch (error) {
      handleError('deleting maintenance record', error);
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
        padding: 2,
      }}
    >
      {/* Logout Icon */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button onClick={() => {
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login page
        }}>
          <LogoutIcon sx={{ color: 'black' }} />
        </Button>
      </Box>

      <Box sx={{ maxWidth: '600px', width: '100%', padding: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Maintenance Management</Typography>
        {message && <Alert severity="info">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="product-select-label">Select Product</InputLabel>
              <Select
                labelId="product-select-label"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="service-type-select-label">Service Type</InputLabel>
              <Select
                labelId="service-type-select-label"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                {serviceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Date of Service"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={dateOfService}
              onChange={(e) => setDateOfService(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Cost of Service"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={costOfService}
              onChange={(e) => setCostOfService(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
              onClick={handleLogOrUpdateMaintenance}
            >
              {isEditing ? 'Update Maintenance' : 'Add Maintenance'}
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Maintenance Records</Typography>
            <List>
              {maintenanceRecords.map((record) => (
                <ListItem key={record._id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                  <ListItemText primary={`${record.product.name} - ${record.serviceType}`} secondary={`Date: ${record.dateOfService.split('T')[0]}, Cost: ₹${record.costOfService}`} />
                  <Box>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditMaintenance(record)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setOpenDeleteDialog(true);
                        setSelectedRecordId(record._id);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Maintenance Record</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this maintenance record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteMaintenance} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="contained"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: '#1976d2', // Primary color for consistency
            '&:hover': { backgroundColor: '#115293' }, // Darker shade on hover
            borderRadius: 2, // Match border radius to the Add Maintenance button
          }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>

      </Box>
    </Box>
  );
}

export default MaintenanceManagement;
