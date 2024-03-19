
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../style/list.css";
import { useAuth } from '../context/authContext';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = () => {
    const { token } = useAuth();
    const baseUrl = "http://localhost:3000";

    const config = {
        headers: {
            Authorization: token
        }
    };
    
    if (!token) return <h1 className="text-center d-flex justify-content-center align-items-center"  style={{"height" : "100vh"}}>Please Login</h1>

    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(baseUrl + '/tasks', config);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSwitchStatus = async (id, status) => {
                try {
                    await axios.put(baseUrl + `/tasks/${id}`, { status: !status }, config);
                    fetchTasks();
                } catch (error) {
                    console.error('Error switching task status:', error);
                }
            };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this task!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            });
    
            if (result.isConfirmed) {
                await axios.delete(baseUrl + `/tasks/${id}`, config);
                fetchTasks();
                Swal.fire(
                    'Deleted!',
                    'Your task has been deleted.',
                    'success'
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your task is safe :)',
                    'error'
                );
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleAddClose = () => {
        setShowAddModal(false);
        setTitle('');
        setDescription('');
    };

    const handleAddSubmit = async () => {
        if (!title || !description) {
            toast.error('Title and description are required.');
            return;
        }
        setLoadingAdd(true);
        try {
            await axios.post(baseUrl + '/tasks', { title, description }, config);
            fetchTasks();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleUpdateClick = (id, title, description) => {
        setSelectedTaskId(id);
        setUpdateTitle(title);
        setUpdateDescription(description);
        setShowUpdateModal(true);
    };

    const handleUpdateClose = () => {
        setShowUpdateModal(false);
        setSelectedTaskId('');
        setUpdateTitle('');
        setUpdateDescription('');
    };

    const handleUpdateSubmit = async () => {
        if (!updateTitle || !updateDescription) {
            toast.error('Title and description are required.');
            return;
        }
        setLoadingUpdate(true);
        try {
            await axios.put(baseUrl + `/tasks/${selectedTaskId}`, { title: updateTitle, description: updateDescription }, config);
            fetchTasks();
            setShowUpdateModal(false);
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredTasks = tasks.filter(task => {
        if (statusFilter === 'all' || (statusFilter === 'completed' && task.status) || (statusFilter === 'incomplete' && !task.status)) {
            return true;
        }
        return false;
    }).filter(task => {
        const searchLowerCase = searchText.toLowerCase();
        return task.title.toLowerCase().includes(searchLowerCase) || task.description.toLowerCase().includes(searchLowerCase);
    });

    return (
        <>
            <div className="App">
                <h1 className="title">Task Manager</h1>
                <button className="add-button" onClick={handleAddClick}>Add Task</button>
                <div>
                    <label htmlFor="statusFilter">Filter by Status:</label>
                    <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>
                <div>
                    <input type="text" placeholder="Search by title or description" value={searchText} onChange={handleSearchTextChange} />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{task.status ? 'Completed' : 'Incomplete'}</td>
                                <td>
                                    <button onClick={() => handleDelete(task.id)} className="delete-btn">Delete</button>
                                    <button onClick={() => handleUpdateClick(task.id, task.title, task.description)} className="update-btn">Update</button>
                                    <button onClick={() => handleSwitchStatus(task.id, task.status)} className="status-btn">
                                        {task.status ? 'Mark Incomplete' : 'Mark Complete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Task Modal */}
            <Modal show={showAddModal} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleAddSubmit}>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddSubmit} disabled={loadingAdd}>
                        {loadingAdd ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Task Modal */}
            <Modal show={showUpdateModal} onHide={handleUpdateClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleUpdateSubmit}>
                        <input type="text" placeholder="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
                        <input type="text" placeholder="Description" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUpdateClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSubmit} disabled={loadingUpdate}>
                        {loadingUpdate ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Task;
