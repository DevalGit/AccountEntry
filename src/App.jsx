import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Table, InputGroup, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { Pencil, Search, Trash, PlusCircle, Calculator, X, ChevronDown, Building, CreditCard, GeoAlt, Percent, Check2 } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  const handleShowAddModal = () => {
    resetForm();
    setShowAddModal(true);
    setShowSearchDropdown(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  // Handle Edit Modal
  const handleShowEditModal = (account) => {
    setCurrentAccount(account);
    setNewRecord({ ...account });
    setShowEditModal(true);
    setShowSearchDropdown(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
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
      totals.amount += account.amount || 0;
      const discountAmount = (account.amount * account.discount) / 100;
      totals.discount += discountAmount;
      totals.discountedTotal += (account.amount - discountAmount);
      totals.gst += calculateGST(account.amount, account.discount);
      totals.finalAmount += calculateFinalAmount(account.amount, account.discount);
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Account Management</h2>

      {/* Search Section */}
      <div className="row mb-4">
        <div className="col-md-8" ref={searchRef}>
          <div className="position-relative">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Search />
              </InputGroup.Text>
              <Form.Control
                className="border-start-0"
                placeholder="Search accounts by name, PAN, GST, contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchTerm.length > 0) setShowSearchDropdown(true);
                }}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setShowSearchDropdown(false);
                  }}
                >
                  <X size={16} />
                </Button>
              )}
              <InputGroup.Text className="bg-white border-start-0">
                <ChevronDown />
              </InputGroup.Text>
            </InputGroup>

            {/* Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="position-absolute w-100 mt-1 shadow-lg border rounded bg-white search-dropdown" style={{ zIndex: 1000, maxHeight: '350px', overflowY: 'auto', animation: 'fadeIn 0.3s' }}>
                {isLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" role="status" variant="primary" />
                    <span className="ms-2">Searching...</span>
                  </div>
                ) : (
                  <>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map(account => (
                        <div
                          key={account.id}
                          className="p-3 border-bottom account-item hover-highlight"
                          onClick={() => handleSelectAccount(account)}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <div>
                              <h6 className="mb-0 d-flex align-items-center">
                                <Building className="me-2" /> {account.name}
                                {selectedAccount && selectedAccount.id === account.id && (
                                  <Badge bg="primary" pill className="ms-2 d-flex align-items-center">
                                    <Check2 size={10} className="me-1" /> Selected
                                  </Badge>
                                )}
                              </h6>
                              <span className="text-muted small">{account.contactPerson} | {account.phone}</span>
                            </div>
                            <div>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowEditModal(account);
                                }}
                              >
                                <Pencil size={16} className="text-primary" />
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAccount(account.id);
                                }}
                              >
                                <Trash size={16} className="text-danger" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 small d-flex flex-wrap">
                            <span className="me-3"><strong>PAN:</strong> {account.panNo}</span>
                            <span className="me-3"><strong>GST:</strong> {account.gstNo}</span>
                            <span><strong>Discount:</strong> {account.discount}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="mb-3">No accounts found matching "{searchTerm}"</p>
                        <Button variant="success" size="sm" onClick={handleShowAddModal}>
                          <PlusCircle className="me-1" /> Add New Account
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4 text-end">
          <Button variant="primary" onClick={handleShowAddModal}>
            <PlusCircle className="me-1" /> Add New Account
          </Button>
        </div>
      </div>

      {/* Loader */}
      {isLoading && !showSearchDropdown && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Accounts Table Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Accounts List</h5>
        </div>
        <div className="card-body p-0">
          <div style={{ height: '350px', overflowY: 'auto' }}>
            <Table hover responsive className="mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>PAN No</th>
                  <th>GST No</th>
                  <th>Amount (₹)</th>
                  <th>Discount</th>
                  <th>Final Amount (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map(account => (
                    <tr
                      key={account.id}
                      className={selectedAccount && selectedAccount.id === account.id ? 'table-active' : ''}
                    >
                      <td>{account.id}</td>
                      <td>{account.name}</td>
                      <td>{account.panNo}</td>
                      <td>{account.gstNo}</td>
                      <td>
                        <Form.Control
                          type="number"
                          size="sm"
                          value={account.amount}
                          onChange={(e) => handleAmountChange(account.id, e.target.value)}
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>
                        <Badge bg="info" pill>{account.discount}%</Badge>
                      </td>
                      <td>
                        {calculateFinalAmount(account.amount, account.discount).toFixed(2)}
                      </td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleSelectAccount(account)}
                        >
                          Select
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowEditModal(account)}
                        >
                          <Pencil size={14} /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <p>No accounts found</p>
                      <Button variant="success" size="sm" onClick={handleShowAddModal}>
                        <PlusCircle className="me-1" /> Add New Account
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td colSpan="4" className="text-end fw-bold">Totals:</td>
                  <td className="fw-bold">₹ {totals.amount.toFixed(2)}</td>
                  <td className="text-danger fw-bold">- ₹ {totals.discount.toFixed(2)}</td>
                  <td className="fw-bold">₹ {totals.finalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      {/* Summary and Calculation Section */}
      <div className="row mt-4">
        <div className="col-md-6">
          <Card className="mb-4 shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              Selected Account Details
            </Card.Header>
            <Card.Body>
              {selectedAccount ? (
                <>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between">
                      <h5 className="mb-3">{selectedAccount.name}</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowEditModal(selectedAccount)}
                      >
                        <Pencil size={14} className="me-1" /> Edit
                      </Button>
                    </div>

                    <Row className="g-3">
                      <Col md={6}>
                        <div className="d-flex align-items-start">
                          <CreditCard className="text-primary mt-1 me-2" />
                          <div>
                            <div className="small text-muted">PAN</div>
                            <div>{selectedAccount.panNo}</div>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-start">
                          <CreditCard className="text-primary mt-1 me-2" />
                          <div>
                            <div className="small text-muted">GST</div>
                            <div>{selectedAccount.gstNo}</div>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-start">
                          <Building className="text-primary mt-1 me-2" />
                          <div>
                            <div className="small text-muted">Contact Person</div>
                            <div>{selectedAccount.contactPerson}</div>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-start">
                          <GeoAlt className="text-primary mt-1 me-2" />
                          <div>
                            <div className="small text-muted">Address</div>
                            <div>{selectedAccount.address}</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <h6 className="d-flex align-items-center mb-3">
                      <Percent className="text-primary me-2" /> Discount Information
                    </h6>
                    <p><strong>Rate:</strong> {selectedAccount.discount}%</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${selectedAccount.discount * 10}%` }}
                        aria-valuenow={selectedAccount.discount}
                        aria-valuemin="0"
                        aria-valuemax="10"
                      >
                        {selectedAccount.discount}%
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted py-5">
                  <Building size={48} className="mb-3 text-secondary" />
                  <p className="mb-1">No account selected</p>
                  <p>Select an account from the table to view details</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <span>Invoice Calculation</span>
                <Calculator size={20} />
              </div>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label>Invoice Amount</Form.Label>
                <InputGroup>
                  <InputGroup.Text>₹</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(parseFloat(e.target.value) || 0)}
                  />
                </InputGroup>
              </Form.Group>

              {selectedAccount ? (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <tbody>
                      <tr>
                        <td className="table-light">Invoice Amount</td>
                        <td className="text-end">₹ {invoiceAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="table-light">Discount ({selectedDiscount}%)</td>
                        <td className="text-end text-danger">- ₹ {((invoiceAmount * selectedDiscount) / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="table-light">Amount after Discount</td>
                        <td className="text-end">₹ {calculateDiscountedTotal(invoiceAmount, selectedDiscount).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="table-light">GST (18%)</td>
                        <td className="text-end">₹ {calculateGST(invoiceAmount, selectedDiscount).toFixed(2)}</td>
                      </tr>
                      <tr className="table-primary fw-bold">
                        <td>Final Amount</td>
                        <td className="text-end">₹ {calculateFinalAmount(invoiceAmount, selectedDiscount).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-warning text-center">
                  <p className="mb-3">Please select an account to calculate invoice with discount</p>
                  <small>Account details will appear here once selected</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Add Account Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <PlusCircle className="me-2 text-primary" />
            Add New Account
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAccount}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Account Name*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><Building size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter company name"
                      name="name"
                      value={newRecord.name}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact person name"
                    name="contactPerson"
                    value={newRecord.contactPerson}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>PAN Number*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><CreditCard size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="ABCDE1234F"
                      name="panNo"
                      value={newRecord.panNo}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>GST Number*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><CreditCard size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="27ABCDE1234F1Z5"
                      name="gstNo"
                      value={newRecord.gstNo}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phone"
                    value={newRecord.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={newRecord.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><GeoAlt size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter address"
                      name="address"
                      value={newRecord.address}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Discount (%)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><Percent size={16} /></InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter discount percentage"
                      name="discount"
                      value={newRecord.discount}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount (₹)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount"
                      name="amount"
                      value={newRecord.amount}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <PlusCircle className="me-1" /> Add Account
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <Pencil className="me-2 text-primary" />
            Edit Account
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateAccount}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Account Name*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><Building size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter company name"
                      name="name"
                      value={newRecord.name}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact person name"
                    name="contactPerson"
                    value={newRecord.contactPerson}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>PAN Number*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><CreditCard size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="ABCDE1234F"
                      name="panNo"
                      value={newRecord.panNo}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>GST Number*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><CreditCard size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="27ABCDE1234F1Z5"
                      name="gstNo"
                      value={newRecord.gstNo}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    name="phone"
                    value={newRecord.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={newRecord.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><GeoAlt size={16} /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter address"
                      name="address"
                      value={newRecord.address}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Discount (%)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><Percent size={16} /></InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter discount percentage"
                      name="discount"
                      value={newRecord.discount}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Amount (₹)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">₹</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount"
                      name="amount"
                      value={newRecord.amount}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil className="me-1" /> Update Account
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Custom CSS */}
      <style>
        {`
          .search-dropdown {
            animation: fadeIn 0.3s;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .account-item {
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .account-item:hover {
            background-color: #f8f9fa;
          }
          
          .hover-highlight:hover {
            background-color: rgba(13, 110, 253, 0.1);
          }
          
          .table-active {
            background-color: rgba(13, 110, 253, 0.1) !important;
          }
          
          .progress {
            height: 8px;
          }
        `}
      </style>
    </div>
  );
};

export default App;