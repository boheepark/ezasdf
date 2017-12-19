import React from 'react';
import {Table} from 'react-bootstrap';

const UserList = (props) => {
  return (
    <div>
      <h1>All Users</h1>
      <hr/>
      <br/>
      <Table striped bordered condensed hover>
        <thead>
        <tr>
          <th>User ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Active</th>
          <th>Admin</th>
          <th>Created Date</th>
        </tr>
        </thead>
        <tbody>
          {
            props.users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{String(user.active)}</td>
                  <td>{String(user.admin)}</td>
                  <td>{user.created_at}</td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
