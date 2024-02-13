import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from 'features/user';
import { updateUser } from 'features/editUserSlice';

const DashboardPage = () => {
  const { user, loading, isAuthenticated, users } = useSelector(state => state.user);
  const { selectedUser } = useSelector(state => state.edit);
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const handleClick = userID => {
    dispatch(deleteUser(userID));
  };

  const handleEdit = sltdUser => {
    dispatch(updateUser(sltdUser));
    navigate('/editUser')
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(query.toLowerCase());
  });

  if (!isAuthenticated && !loading && user === null) return <Navigate to="/login" />;
  if (user?.is_staff) {
    return (
      <Layout title="Auth Site | Dashboard" content="Dashboard page">
        <h1>You are an Administrator</h1>
        <div className="mb-4 mt-4" style={{ marginRight: '200px' }}>
          <form className="d-flex" role="search">
            <input
              className="form-control"
              style={{ width: '400px' }}
              onChange={e => setQuery(e.target.value)}
              type="search"
              placeholder="Search"
            />&nbsp;&nbsp;
            <button style={{ width: '90px' }} className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
        <div className="row">
          {filteredUsers.map(user => (
            <div className="col-md-4 mb-3" key={user.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{`${user.first_name} ${user.last_name}`}</h5>
                  <p className="card-text">Email: {user.email}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        handleEdit(user);
                      }}
                      variant="primary"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        handleClick(user.id);
                      }}
                      variant="danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout title="Auth Site | Dashboard" content="Dashboard page">
        {loading || user === null ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div style={{ marginLeft: '100px' }}>
            <h1 className="mb-5">Dashboard</h1>
            <h5>User Details</h5>
            <ul>
              <li>First Name: {user.first_name}</li>
              <li>Last Name: {user.last_name}</li>
              <li>Email : {user.email}</li>
            </ul>
            {user.profile_picture && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-220px' }}>
                <img
                  className="img-fixed"
                  width={200}
                  height={200}
                  id="profile-image"
                  src={`http://localhost:8000${user.profile_picture}`}
                  alt="User Image"
                />
              </div>
            )}
          </div>
        )}
      </Layout>
    );
  }
};

export default DashboardPage;
