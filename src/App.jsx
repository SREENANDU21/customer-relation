import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, X } from 'lucide-react';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';

const STORAGE_KEY = 'lumina_crm_customers';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="controls animate-fade-in" style={{ marginBottom: '2rem', animationDelay: '0.1s' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search customers..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CustomerList customers={filteredCustomers} />

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
