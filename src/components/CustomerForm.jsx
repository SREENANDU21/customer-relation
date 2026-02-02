import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

export default function CustomerForm({ onAdd, initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        type: 'Outdoor P4',
        size: '',
        followUp: '',
        requirements: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Customer/Business Name</label>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. City Mall Display"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        name="contact"
                        required
                        placeholder="+91 98765..."
                        value={formData.contact}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        required
                        placeholder="City/Area"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                    <label>Board Type</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <optgroup label="Outdoor">
                            <option value="Outdoor P4">Outdoor P4</option>
                            <option value="Outdoor P5">Outdoor P5</option>
                            <option value="Outdoor P3">Outdoor P3</option>
                            <option value="Outdoor P2.5">Outdoor P2.5</option>
                        </optgroup>
                        <optgroup label="Indoor">
                            <option value="Indoor P3">Indoor P3</option>
                            <option value="Indoor P2.5">Indoor P2.5</option>
                        </optgroup>
                        <optgroup label="Rental">
                            <option value="LED Van Rent">LED Van Rent</option>
                        </optgroup>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Size (W x H)</label>
                    <input
                        type="text"
                        name="size"
                        placeholder="e.g. 10x6 ft"
                        value={formData.size}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Follow-up Reminder</label>
                <input
                    type="datetime-local"
                    name="followUp"
                    value={formData.followUp}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Requirements / Notes</label>
                <textarea
                    name="requirements"
                    rows="3"
                    placeholder="Specific mounting needs, power supply..."
                    value={formData.requirements}
                    onChange={handleChange}
                ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {initialData ? 'Update Customer' : 'Save Customer'}
            </button>
        </form>
    );
}
