import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  Grid,
  Box,
  Badge,
  CircularProgress,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Calculate as CalculateIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Business as BusinessIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationOnIcon,
  Percent as PercentIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const HoverableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer'
  },
}));

const AccountCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const InvoiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const App = () => {
  // Sample initial data with amount field
  const initialAccounts = [
    { id: 1, name: 'ABC Company', panNo: 'ABCDE1234F', gstNo: '27ABCDE1234F1Z5', address: 'Mumbai', discount: 10, contactPerson: 'John Doe', email: 'john@abc.com', phone: '9876543210', amount: 1000 },
    { id: 2, name: 'XYZ Enterprises', panNo: 'XYZGH5678I', gstNo: '06XYZGH5678I1Z3', address: 'Delhi', discount: 5, contactPerson: 'Jane Smith', email: 'jane@xyz.com', phone: '8765432109', amount: 1500 },
    { id: 3, name: 'PQR Services', panNo: 'PQRST9012J', gstNo: '29PQRST9012J1Z1', address: 'Bangalore', discount: 8, contactPerson: 'Mike Johnson', email: 'mike@pqr.com', phone: '7654321098', amount: 2000 },
    { id: 4, name: 'Deval Solutions', panNo: 'DEVAL2345K', gstNo: '24DEVAL2345K1Z8', address: 'Ahmedabad', discount: 12, contactPerson: 'Deval Patel', email: 'deval@solutions.com', phone: '9988776655', amount: 2500 },
    { id: 5, name: 'Tech Innovators', panNo: 'TECHN6789L', gstNo: '33TECHN6789L1Z5', address: 'Chennai', discount: 7, contactPerson: 'Rahul Sharma', email: 'rahul@techinnovators.com', phone: '8877665544', amount: 3000 },
  ];

  // State management
  const [accounts, setAccounts] = useState(initialAccounts);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [newRecord, setNewRecord] = useState({
    id: null,
    name: '',
    panNo: '',
    gstNo: '',
    address: '',
    discount: 0,
    contactPerson: '',
    email: '',
    phone: '',
    amount: 0
  });
  const [selectedGST, setSelectedGST] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const searchRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Default invoice amount when account is selected
  const DEFAULT_INVOICE_AMOUNT = 1000;

  // Search fields
  const searchFields = ['id', 'name', 'panNo', 'gstNo', 'address', 'contactPerson', 'email', 'phone'];

  // Filter accounts based on search across all fields
  const filteredAccounts = accounts.filter(account => {
    if (!searchTerm) return true;

    return searchFields.some(field =>
      String(account[field]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle clicks outside of the search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simulate loading when searching
  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (searchTerm.length > 0) {
          setShowSearchDropdown(true);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowSearchDropdown(false);
    }
  }, [searchTerm]);

  // Reset form fields
  const resetForm = () => {
    setNewRecord({
      id: null,
      name: '',
      panNo: '',
      gstNo: '',
      address: '',
      discount: 0,
      contactPerson: '',
      email: '',
      phone: '',
      amount: 0
    });
  };

  // Handle Add Modal
  const handleOpenAddModal = () => {
    resetForm();
    setOpenAddModal(true);
    setShowSearchDropdown(false);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  // Handle Edit Modal
  const handleOpenEditModal = (account) => {
    setCurrentAccount(account);
    setNewRecord({ ...account });
    setOpenEditModal(true);
    setShowSearchDropdown(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentAccount(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // Handle amount change for a specific account
  const handleAmountChange = (id, value) => {
    const updatedAccounts = accounts.map(account =>
      account.id === id ? { ...account, amount: parseFloat(value) || 0 } : account
    );
    setAccounts(updatedAccounts);
  };

  // Add new account
  const handleAddAccount = (e) => {
    e.preventDefault();
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const accountToAdd = { ...newRecord, id: newId, amount: newRecord.amount || DEFAULT_INVOICE_AMOUNT };

    setFormSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setAccounts([...accounts, accountToAdd]);
      setFormSubmitting(false);
      handleCloseAddModal();

      // Show the newly added account in the summary
      setSelectedAccount(accountToAdd);
      setSelectedGST(accountToAdd.gstNo);
      setSelectedDiscount(accountToAdd.discount);
      setInvoiceAmount(accountToAdd.amount);

      // Clear search after adding
      setSearchTerm('');
    }, 800);
  };

  // Update existing account
  const handleUpdateAccount = (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const updatedAccounts = accounts.map(account =>
        account.id === currentAccount.id ? { ...newRecord, amount: newRecord.amount || account.amount } : account
      );
      setAccounts(updatedAccounts);

      // Update selected account if it was the one edited
      if (selectedAccount && selectedAccount.id === currentAccount.id) {
        const updatedAccount = { ...newRecord, amount: newRecord.amount || selectedAccount.amount };
        setSelectedAccount(updatedAccount);
        setSelectedGST(updatedAccount.gstNo);
        setSelectedDiscount(updatedAccount.discount);
        setInvoiceAmount(updatedAccount.amount);
      }

      setFormSubmitting(false);
      handleCloseEditModal();

      // Clear search after updating
      setSearchTerm('');
    }, 800);
  };

  // Delete account
  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setAccounts(accounts.filter(account => account.id !== id));

        // Clear selected account if it was deleted
        if (selectedAccount && selectedAccount.id === id) {
          setSelectedAccount(null);
          setSelectedGST(null);
          setSelectedDiscount(null);
          setInvoiceAmount(0);
        }

        setIsLoading(false);
        setShowSearchDropdown(false);
      }, 800);
    }
  };

  // Handle select account
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setSelectedGST(account.gstNo);
    setSelectedDiscount(account.discount);
    setInvoiceAmount(account.amount);
    setSearchTerm('');
    setShowSearchDropdown(false);
  };

  // Calculate invoice total with discount for a specific account
  const calculateDiscountedTotal = (amount, discount) => {
    if (!discount || !amount) return amount;
    const discountAmount = (amount * discount) / 100;
    return amount - discountAmount;
  };

  // Calculate GST for a specific account
  const calculateGST = (amount, discount) => {
    const discountedAmount = calculateDiscountedTotal(amount, discount);
    return discountedAmount * 0.18; // Assuming 18% GST
  };

  // Calculate final amount with GST for a specific account
  const calculateFinalAmount = (amount, discount) => {
    const discountedAmount = calculateDiscountedTotal(amount, discount);
    const gstAmount = calculateGST(amount, discount);
    return discountedAmount + gstAmount;
  };

  // Calculate totals for all accounts
  const calculateTotals = () => {
    const totals = {
      amount: 0,
      discount: 0,
      discountedTotal: 0,
      gst: 0,
      finalAmount: 0
    };

    accounts.forEach(account => {
      const amount = Number(account.amount) || 0;
      const discount = Number(account.discount) || 0;

      totals.amount += amount;

      const discountAmount = (amount * discount) / 100;
      totals.discount += discountAmount;

      const discountedTotal = amount - discountAmount;
      totals.discountedTotal += discountedTotal;

      totals.gst += calculateGST(amount, discount);
      totals.finalAmount += calculateFinalAmount(amount, discount);
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Account Management
      </Typography>

      {/* Search and Add Section */}
      <Grid container spacing={2} sx={{ mb: 4 }} alignItems="center">
        <Grid item xs={12} md={8} ref={searchRef}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              placeholder="Search accounts by name, PAN, GST, contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.length > 0) setShowSearchDropdown(true);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearchDropdown(false);
                      }}
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <KeyboardArrowDownIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <Paper sx={{
                position: 'absolute',
                width: '100%',
                mt: 1,
                boxShadow: 3,
                zIndex: 1000,
                maxHeight: 400,
                overflow: 'auto',
                animation: 'fadeIn 0.3s'
              }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>Searching...</Typography>
                  </Box>
                ) : (
                  <>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map(account => (
                        <Box
                          key={account.id}
                          sx={{
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleSelectAccount(account)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" />
                                {account.name}
                                {selectedAccount && selectedAccount.id === account.id && (
                                  <Chip
                                    label="Selected"
                                    color="primary"
                                    size="small"
                                    icon={<CheckIcon fontSize="small" />}
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {account.contactPerson} | {account.phone}
                              </Typography>
                            </Box>
                            <Box>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(account);
                                  }}
                                >
                                  <EditIcon fontSize="small" color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAccount(account.id);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <span><strong>PAN:</strong> {account.panNo}</span>
                              <span><strong>GST:</strong> {account.gstNo}</span>
                              <span><strong>Discount:</strong> {account.discount}%</span>
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          No accounts found matching "{searchTerm}"
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleOpenAddModal}
                        >
                          Add New Account
                        </Button>
                      </Box>
                    )}
                  </>
                )}
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: isMobile ? 'left' : 'right' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
            fullWidth={isMobile}
          >
            Add New Account
          </Button>

        </Grid>
      </Grid>

      {/* Loader */}
      {isLoading && !showSearchDropdown && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Accounts Table Section */}
      <AccountCard sx={{ mb: 4 }}>
        <CardHeader
          title="Accounts List"
          titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 350, overflow: 'auto' }}>
            <TableContainer>
              <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>PAN No</TableCell>
                    <TableCell>GST No</TableCell>
                    <TableCell>Amount (₹)</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Final Amount (₹)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map(account => (
                      <HoverableRow
                        key={account.id}
                        hover
                        selected={selectedAccount && selectedAccount.id === account.id}
                        sx={{
                          '&.Mui-selected': {
                            backgroundColor: 'primary.lighter',
                            '&:hover': {
                              backgroundColor: 'primary.lighter'
                            }
                          }
                        }}
                      >
                        <TableCell>{account.id}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.panNo}</TableCell>
                        <TableCell>{account.gstNo}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={account.amount}
                            onChange={(e) => handleAmountChange(account.id, e.target.value)}
                            sx={{ width: 100 }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${account.discount}%`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {calculateFinalAmount(account.amount, account.discount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Select">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleSelectAccount(account)}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleOpenEditModal(account)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </HoverableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          No accounts found
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleOpenAddModal}
                        >
                          Add New Account
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </AccountCard>

      {/* Summary and Calculation Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AccountCard>
            <CardHeader
              title="Selected Account Details"
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ bgcolor: 'primary.main', color: 'common.white' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {selectedAccount ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedAccount.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => handleOpenEditModal(selectedAccount)}
                      >
                        Edit
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <CreditCardIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              PAN
                            </Typography>
                            <Typography variant="body2">{selectedAccount.panNo}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <CreditCardIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              GST
                            </Typography>
                            <Typography variant="body2">{selectedAccount.gstNo}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <PersonIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Contact Person
                            </Typography>
                            <Typography variant="body2">{selectedAccount.contactPerson}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Address
                            </Typography>
                            <Typography variant="body2">{selectedAccount.address}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <EmailIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                            <Typography variant="body2">{selectedAccount.email}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <PhoneIcon color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone
                            </Typography>
                            <Typography variant="body2">{selectedAccount.phone}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PercentIcon color="primary" sx={{ mr: 1 }} fontSize="small" />
                      Discount Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Rate:</strong> {selectedAccount.discount}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(selectedAccount.discount * 10, 100)}
                      color="success"
                      sx={{ height: 8, mb: 2 }}
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BusinessIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    No account selected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an account from the table to view details
                  </Typography>
                </Box>
              )}
            </CardContent>
          </AccountCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InvoiceCard>
            <CardHeader
              title="Invoice Calculation"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<CalculateIcon sx={{ color: 'common.white' }} />}
              sx={{ bgcolor: 'primary.main', color: 'common.white' }}
            />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Invoice Amount"
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  variant="outlined"
                />
              </FormControl>

              {selectedAccount ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Invoice Amount</TableCell>
                        <TableCell align="right">₹ {invoiceAmount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Discount ({selectedDiscount}%)
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'error.main' }}>
                          - ₹ {((invoiceAmount * selectedDiscount) / 100).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount after Discount</TableCell>
                        <TableCell align="right">
                          ₹ {calculateDiscountedTotal(invoiceAmount, selectedDiscount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>GST (18%)</TableCell>
                        <TableCell align="right">
                          ₹ {calculateGST(invoiceAmount, selectedDiscount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 'bold' } }}>
                        <TableCell>Final Amount</TableCell>
                        <TableCell align="right">
                          ₹ {calculateFinalAmount(invoiceAmount, selectedDiscount).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Please select an account to calculate invoice with discount
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account details will appear here once selected
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </InvoiceCard>
        </Grid>
      </Grid>

      {/* Add Account Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
          <AddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Add New Account</Typography>
        </DialogTitle>
        <form onSubmit={handleAddAccount}>
          <DialogContent dividers sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  placeholder="Enter company name"
                  name="name"
                  value={newRecord.name}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  placeholder="Enter contact person name"
                  name="contactPerson"
                  value={newRecord.contactPerson}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  name="panNo"
                  value={newRecord.panNo}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  placeholder="27ABCDE1234F1Z5"
                  name="gstNo"
                  value={newRecord.gstNo}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter phone number"
                  name="phone"
                  value={newRecord.phone}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter email address"
                  name="email"
                  value={newRecord.email}
                  onChange={handleInputChange}
                  type="email"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  placeholder="Enter address"
                  name="address"
                  value={newRecord.address}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  placeholder="Enter discount percentage"
                  name="discount"
                  value={newRecord.discount}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount (₹)"
                  placeholder="Enter amount"
                  name="amount"
                  value={newRecord.amount}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Button onClick={handleCloseAddModal} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formSubmitting}
              startIcon={
                formSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
            >
              {formSubmitting ? 'Processing...' : 'Add Account'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
          <EditIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Edit Account</Typography>
        </DialogTitle>
        <form onSubmit={handleUpdateAccount}>
          <DialogContent dividers sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  placeholder="Enter company name"
                  name="name"
                  value={newRecord.name}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  placeholder="Enter contact person name"
                  name="contactPerson"
                  value={newRecord.contactPerson}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  name="panNo"
                  value={newRecord.panNo}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  placeholder="27ABCDE1234F1Z5"
                  name="gstNo"
                  value={newRecord.gstNo}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="Enter phone number"
                  name="phone"
                  value={newRecord.phone}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  placeholder="Enter email address"
                  name="email"
                  value={newRecord.email}
                  onChange={handleInputChange}
                  type="email"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  placeholder="Enter address"
                  name="address"
                  value={newRecord.address}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  placeholder="Enter discount percentage"
                  name="discount"
                  value={newRecord.discount}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PercentIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount (₹)"
                  placeholder="Enter amount"
                  name="amount"
                  value={newRecord.amount}
                  onChange={handleInputChange}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ bgcolor: 'background.paper', p: 2 }}>
            <Button onClick={handleCloseEditModal} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formSubmitting}
              startIcon={
                formSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <EditIcon />
                )
              }
            >
              {formSubmitting ? 'Processing...' : 'Update Account'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Total Summary Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <CalculateIcon color="primary" sx={{ mr: 1 }} />
          Overall Summary
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <StyledTableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Invoice Amount</TableCell>
                <TableCell align="right">₹ {totals.amount.toFixed(2)}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Discount Amount</TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  - ₹ {totals.discount.toFixed(2)}
                </TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount after Discount</TableCell>
                <TableCell align="right">₹ {totals.discountedTotal.toFixed(2)}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total GST</TableCell>
                <TableCell align="right">₹ {totals.gst.toFixed(2)}</TableCell>
              </StyledTableRow>
              <StyledTableRow sx={{
                '& .MuiTableCell-root': {
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }
              }}>
                <TableCell>Final Amount</TableCell>
                <TableCell align="right">₹ {totals.finalAmount.toFixed(2)}</TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default App;