import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import './Dashboard.css';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'Pending' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({ title: task.title, description: task.description, status: task.status });
        } else {
            setEditingTask(null);
            setFormData({ title: '', description: '', status: 'Pending' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingTask) {
                const updatedTask = await updateTask(editingTask.id, formData);
                setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
            } else {
                const newTask = await createTask(formData);
                setTasks([...tasks, newTask]);
            }
            closeModal();
        } catch (err) {
            setError('Failed to save task');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                setTasks(tasks.filter(t => t.id !== id));
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />

            <main className="container dashboard-main">
                <div className="dashboard-header flex items-center justify-between">
                    <div>
                        <h1>Your Tasks</h1>
                        <p className="text-muted">Manage your daily activities and projects</p>
                    </div>
                    <Button onClick={() => openModal()} variant="primary">
                        <Plus size={18} /> New Task
                    </Button>
                </div>

                {error && <div className="alert-error animate-fade-in">{error}</div>}

                {loading ? (
                    <div className="flex justify-center flex-col items-center" style={{ height: '50vh' }}>
                        <div className="spinner"></div>
                        <p className="text-muted" style={{ marginTop: '1rem' }}>Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state card animate-fade-in">
                        <h3>No tasks yet</h3>
                        <p className="text-muted">Create your first task to get started.</p>
                        <Button onClick={() => openModal()} className="mt-md" variant="secondary">Create Task</Button>
                    </div>
                ) : (
                    <div className="task-grid">
                        {tasks.map(task => (
                            <div key={task.id} className="task-card card animate-fade-in">
                                <div className="task-header flex justify-between items-center">
                                    <span className={`task-badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                    <div className="task-actions flex gap-sm">
                                        <button onClick={() => openModal(task)} className="btn-icon" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="btn-icon text-danger" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3>{task.title}</h3>
                                <p className="task-desc">{task.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Basic Modal Implementation */}
            {isModalOpen && (
                <div className="modal-overlay animate-fade-in">
                    <div className="modal-content card">
                        <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-md mt-md">
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Task title"
                            />
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    placeholder="Task description"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="modal-actions flex justify-between mt-sm">
                                <Button type="button" variant="secondary" onClick={closeModal} disabled={saving}>Cancel</Button>
                                <Button type="submit" variant="primary" isLoading={saving}>Save Task</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
