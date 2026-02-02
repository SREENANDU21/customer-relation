import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';

const STORAGE_KEY = 'lumina_crm_customers';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'name' | 'location'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Initial Data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse customers", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save Data on Change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...customerData
    };
    // Add to top
    setCustomers(prev => [newCustomer, ...prev]);
    setIsModalOpen(false);
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  // Filter & Sort Logic
  const getProcessedCustomers = () => {
    // 1. Filter
    let result = customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location);
      } else if (sortBy === 'date') {
        // Sort by follow-up date (closest first). 
        // If no date, put at bottom.
        if (!a.followUp && !b.followUp) return 0;
        if (!a.followUp) return 1;
        if (!b.followUp) return -1;
        return new Date(a.followUp) - new Date(b.followUp);
      }
      return 0;
    });

    return result;
  };

  const filteredCustomers = getProcessedCustomers();

  return (
    <div className="container">
      <header className="animate-fade-in">
        <div>
          <h1>Lumina CRM</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your LED Board Clients efficiently</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <PlusCircle size={20} /> Add Customer
        </button>
      </header>

      <div className="controls animate-fade-in" style={{ marginBottom: '2rem', animationDelay: '0.1s', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search customers..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="date">Follow-up Date</option>
            <option value="name">Name</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      <CustomerList customers={filteredCustomers} onDelete={deleteCustomer} />

      {/* Modal Overlay */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
        <div className="modal glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2>New Customer</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          {isModalOpen && (
            <CustomerForm onAdd={addCustomer} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
