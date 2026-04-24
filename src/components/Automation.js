import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Play, Pause, Edit, ChevronDown, ChevronUp, Clock, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import './Automation.css';

const TEMPLATES = [
    {
        id: 'auto-qualify',
        name: 'Auto-Qualify High-Score Leads',
        trigger: 'lead_created',
        condition: 'score_above',
        conditionValue: 80,
        action: 'change_status',
        actionValue: 'qualified',
        description: 'Automatically set lead status to "Qualified" when score is above 80',
    },
    {
        id: 'welcome-notification',
        name: 'New Customer Welcome',
        trigger: 'customer_created',
        condition: 'always',
        conditionValue: '',
        action: 'send_notification',
        actionValue: 'Welcome! A new customer has been added.',
        description: 'Send a notification whenever a new customer is created',
    },
    {
        id: 'followup-reminder',
        name: 'Follow-up Reminder',
        trigger: 'lead_created',
        condition: 'status_equals',
        conditionValue: 'contacted',
        action: 'send_notification',
        actionValue: 'Remember to follow up on this lead!',
        description: 'Remind you to follow up when a lead is in "Contacted" status',
    },
    {
        id: 'lost-alert',
        name: 'Lost Lead Alert',
        trigger: 'lead_status_changed',
        condition: 'status_equals',
        conditionValue: 'lost',
        action: 'send_notification',
        actionValue: 'A lead has been marked as lost. Review and analyze.',
        description: 'Alert when a lead is marked as lost',
    },
];

const Automation = () => {
    const [rules, setRules] = useState(() => {
        const saved = localStorage.getItem('cp-automation-rules');
        return saved ? JSON.parse(saved) : [];
    });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activityLog, setActivityLog] = useState(() => {
        const saved = localStorage.getItem('cp-automation-log');
        return saved ? JSON.parse(saved) : [];
    });
    const [formData, setFormData] = useState({
        name: '',
        trigger: 'lead_created',
        condition: 'always',
        conditionValue: '',
        action: 'send_notification',
        actionValue: '',
        enabled: true,
    });

    useEffect(() => {
        localStorage.setItem('cp-automation-rules', JSON.stringify(rules));
    }, [rules]);

    useEffect(() => {
        localStorage.setItem('cp-automation-log', JSON.stringify(activityLog));
    }, [activityLog]);

    const handleSave = () => {
        if (!formData.name.trim()) return;

        if (editingId) {
            setRules(prev => prev.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
        } else {
            const newRule = { ...formData, id: Date.now().toString() };
            setRules(prev => [...prev, newRule]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            trigger: 'lead_created',
            condition: 'always',
            conditionValue: '',
            action: 'send_notification',
            actionValue: '',
            enabled: true,
        });
        setShowForm(false);
        setEditingId(null);
    };

    const handleEdit = (rule) => {
        setFormData(rule);
        setEditingId(rule.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const toggleRule = (id) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const applyTemplate = (template) => {
        setFormData({
            name: template.name,
            trigger: template.trigger,
            condition: template.condition,
            conditionValue: template.conditionValue,
            action: template.action,
            actionValue: template.actionValue,
            enabled: true,
        });
        setShowForm(true);
    };

    const triggerLabels = {
        lead_created: 'When a lead is created',
        customer_created: 'When a customer is created',
        contact_created: 'When a contact is created',
        lead_status_changed: 'When lead status changes',
        customer_status_changed: 'When customer status changes',
    };

    const conditionLabels = {
        always: 'Always',
        score_above: 'Lead score is above',
        status_equals: 'Status equals',
    };

    const actionLabels = {
        change_status: 'Change status to',
        send_notification: 'Send notification',
        assign_tag: 'Assign tag',
    };

    return (
        <div className="automation-page">
            <div className="automation-header">
                <div className="header-content">
                    <div className="header-icon">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1>Automation</h1>
                        <p>Create rules to automate your CRM workflows</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={20} />
                    New Rule
                </button>
            </div>

            {/* Templates */}
            <div className="automation-templates">
                <h3><Settings size={18} /> Quick Templates</h3>
                <div className="templates-grid">
                    {TEMPLATES.map(t => (
                        <button key={t.id} className="template-card" onClick={() => applyTemplate(t)}>
                            <Zap size={16} />
                            <div>
                                <span className="template-name">{t.name}</span>
                                <span className="template-desc">{t.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Rule Form */}
            {showForm && (
                <div className="rule-form-overlay" onClick={resetForm}>
                    <div className="rule-form" onClick={e => e.stopPropagation()}>
                        <h3>{editingId ? 'Edit Rule' : 'Create Automation Rule'}</h3>

                        <div className="form-group">
                            <label>Rule Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Auto-qualify hot leads"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Trigger</label>
                                <select
                                    value={formData.trigger}
                                    onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                                >
                                    {Object.entries(triggerLabels).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Condition</label>
                                <select
                                    value={formData.condition}
                                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    {Object.entries(conditionLabels).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.condition !== 'always' && (
                            <div className="form-group">
                                <label>Condition Value</label>
                                <input
                                    type="text"
                                    value={formData.conditionValue}
                                    onChange={e => setFormData({ ...formData, conditionValue: e.target.value })}
                                    placeholder={formData.condition === 'score_above' ? 'e.g., 80' : 'e.g., qualified'}
                                />
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Action</label>
                                <select
                                    value={formData.action}
                                    onChange={e => setFormData({ ...formData, action: e.target.value })}
                                >
                                    {Object.entries(actionLabels).map(([k, v]) => (
                                        <option key={k} value={k}>{v}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Action Value</label>
                                <input
                                    type="text"
                                    value={formData.actionValue}
                                    onChange={e => setFormData({ ...formData, actionValue: e.target.value })}
                                    placeholder={formData.action === 'change_status' ? 'e.g., qualified' : 'Notification message...'}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                {editingId ? 'Update Rule' : 'Create Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rules List */}
            <div className="rules-section">
                <h3>Active Rules ({rules.length})</h3>
                {rules.length === 0 ? (
                    <div className="empty-rules">
                        <Zap size={48} />
                        <h3>No automation rules yet</h3>
                        <p>Create your first rule or use a template to get started</p>
                    </div>
                ) : (
                    <div className="rules-list">
                        {rules.map(rule => (
                            <div key={rule.id} className={`rule-card ${!rule.enabled ? 'disabled' : ''}`}>
                                <div className="rule-status" onClick={() => toggleRule(rule.id)}>
                                    {rule.enabled ? <Play size={16} /> : <Pause size={16} />}
                                </div>
                                <div className="rule-info">
                                    <h4>{rule.name}</h4>
                                    <div className="rule-flow">
                                        <span className="flow-tag trigger">{triggerLabels[rule.trigger]}</span>
                                        <span className="flow-arrow">→</span>
                                        {rule.condition !== 'always' && (
                                            <>
                                                <span className="flow-tag condition">{conditionLabels[rule.condition]}: {rule.conditionValue}</span>
                                                <span className="flow-arrow">→</span>
                                            </>
                                        )}
                                        <span className="flow-tag action">{actionLabels[rule.action]}: {rule.actionValue}</span>
                                    </div>
                                </div>
                                <div className="rule-actions">
                                    <button className="icon-btn" onClick={() => handleEdit(rule)} title="Edit">
                                        <Edit size={16} />
                                    </button>
                                    <button className="icon-btn danger" onClick={() => handleDelete(rule.id)} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Log */}
            {activityLog.length > 0 && (
                <div className="activity-section">
                    <h3><Clock size={18} /> Recent Activity</h3>
                    <div className="activity-list">
                        {activityLog.slice(0, 10).map((log, i) => (
                            <div key={i} className="activity-item">
                                <CheckCircle size={14} />
                                <span className="activity-text">{log.message}</span>
                                <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Automation;
