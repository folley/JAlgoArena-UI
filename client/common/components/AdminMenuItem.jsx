import React from "react";
import {NavDropdown} from "react-bootstrap";

import FontAwesome from './FontAwesome';
import MenuItem from './MenuItem';

const AdminMenuItem = ({user}) => (
    user && user.role === 'ADMIN'
        ? <NavDropdown title={<span><FontAwesome name="cogs" lg={true}/> Admin</span>} id="basic-nav-dropdown">
            <MenuItem path="/submissionsAdmin" icon="code" title="Submissions"/>
            <MenuItem path="/problemsAdmin" icon="book" title="Problems"/>
            <MenuItem path="/usersAdmin" icon="user" title="Users"/>
        </NavDropdown>
        : null
);

export default AdminMenuItem;