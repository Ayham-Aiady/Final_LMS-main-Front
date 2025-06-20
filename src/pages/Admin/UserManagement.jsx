import { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        );
        const { data, totalPages } = res.data;
        setUsers(data);
        setTotalPages(totalPages);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refresh, page, search]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${id}/role`, { role: newRole });
      setRefresh((r) => r + 1);
    } catch {
      alert('Failed to update role');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${id}/status`, { is_active: !currentStatus });
      setRefresh((r) => r + 1);
    } catch {
      alert('Failed to update user status');
    }
  };

  const handleAddUser = async () => {
    setAddUserLoading(true);
    setAddUserError('');
    try {
      await axios.post('/api/admin/users', newUser);
      setRefresh((r) => r + 1);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setAddUserError(err.response?.data?.message || 'Error creating user');
    } finally {
      setAddUserLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>User Management</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowAddUser(!showAddUser)}>
        {showAddUser ? 'Cancel' : '➕ Add New User'}
      </button>

      {showAddUser && (
        <div className="card mb-4 border">
          <div className="card-body">
            <h5 className="card-title">Add New User</h5>

            {addUserError && <div className="alert alert-danger">{addUserError}</div>}

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Temporary Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="btn btn-success" onClick={handleAddUser} disabled={addUserLoading}>
              {addUserLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  className="form-select"
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <span className={`badge ${u.is_active ? 'bg-success' : 'bg-secondary'}`}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button
                  className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => handleToggleStatus(u.id, u.is_active)}
                >
                  {u.is_active ? 'Deactivate' : 'Reactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Previous
        </button>

        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          className="btn btn-outline-primary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
