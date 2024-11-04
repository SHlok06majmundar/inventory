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
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
          },
        });
        setProducts(res.data);
      } catch (error) {
        handleError('fetching products', error);
      }
    };

    const fetchMaintenanceRecords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/maintenance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
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
        await axios.put(`http://localhost:5000/api/maintenance/${selectedRecordId}`, maintenanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
          },
        });
        setMessage('Maintenance record updated successfully.');
      } else {
        const existingRecord = maintenanceRecords.find(record => record.product._id === selectedProduct);
        if (existingRecord) {
          setMessage('Maintenance record for this product already exists. Edit it instead.');
          return;
        }
        await axios.post('http://localhost:5000/api/maintenance', maintenanceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
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
    const res = await axios.get('http://localhost:5000/api/maintenance', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
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
      await axios.delete(`http://localhost:5000/api/maintenance/${selectedRecordId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token
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
        padding: '0',
        margin: '0',
      }}
    >
      <Box sx={{ maxWidth: '500px', width: '100%', padding: 2 }}>
        <Typography variant="h4" align="center">Maintenance Management</Typography>
        {message && <Alert severity="info">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Card sx={{ marginBottom: 2 }}>
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
              sx={{ marginTop: 2 }}
              onClick={handleLogOrUpdateMaintenance}
            >
              {isEditing ? 'Update Maintenance' : 'Log Maintenance'}
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center">Maintenance Records</Typography>
            <List>
              {maintenanceRecords.map((record) => (
                <ListItem key={record._id}>
                  <ListItemText
                    primary={`Product: ${record.product ? record.product.name : 'Unknown'}, Service: ${record.serviceType}, Date: ${new Date(record.dateOfService).toLocaleDateString()}, Cost: $${record.costOfService}`}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleEditMaintenance(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setSelectedRecordId(record._id);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate('/dashboard')}
          sx={{ marginTop: 2 }}
        >
          Go to Dashboard
        </Button>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this maintenance record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteMaintenance} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default MaintenanceManagement;
