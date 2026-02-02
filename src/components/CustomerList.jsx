import React from 'react';
import { Phone, MapPin, Inbox, Clock, AlertCircle, Trash2, Edit } from 'lucide-react';

export default function CustomerList({ customers, onDelete, onEdit }) {
    if (customers.length === 0) {
        return (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                <Inbox style={{ width: 48, height: 48, opacity: 0.5, marginBottom: '1rem' }} />
                <p>No customers found.</p>
            </div>
        );
    }

    return (
        <div className="customer-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {customers.map((c) => {
                let reminderNode = null;
                if (c.followUp) {
                    const date = new Date(c.followUp);
                    const now = new Date();
                    const isUrgent = date < now;
                    const dateStr = date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

                    reminderNode = (
                        <div className={`reminder-tag ${isUrgent ? 'urgent' : ''}`}>
                            {isUrgent ? <AlertCircle size={16} /> : <Clock size={16} />}
                            {isUrgent ? 'Overdue: ' : 'Follow-up: '} {dateStr}
                        </div>
                    );
                }

                return (
                    <div key={c.id} className="glass-panel customer-card" style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => onEdit(c)}
                                style={{
                                    background: 'rgba(6, 182, 212, 0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.4rem',
                                    color: 'var(--accent-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                title="Edit Customer"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(c.id)}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.4rem',
                                    color: '#fca5a5',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                title="Delete Customer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="card-header" style={{ paddingRight: '5rem' }}>
                            <div>
                                <h3 className="customer-name">{c.name}</h3>
                                <div className="info-row" style={{ marginTop: '0.25rem' }}>
                                    <span className="customer-type">{c.type}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{c.size || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-row">
                            <Phone size={16} />
                            {c.contact}
                        </div>
                        <div className="info-row">
                            <MapPin size={16} />
                            {c.location}
                        </div>

                        <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                            {c.requirements || 'No specific requirements.'}
                        </div>

                        {reminderNode}
                    </div>
                );
            })}
        </div>
    );
}
