import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserList = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }
    fetchUsers();
    checkAdminStatus();
  }, [page, role]);

  const checkAdminStatus = () => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `${BASE_URL}/users/getUsers?role=${role}&page=${page + 1}&limit=${rowsPerPage}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setUsers(response.data.data.docs);
        setTotalUsers(response.data.data.totalDocs);
      } else {
        console.error("Unexpected response format:", response.data);
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error.response?.data || error.message);
      setUsers([]);
      setTotalUsers(0);
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${BASE_URL}/users/update/${editUser._id}`,
        { name: editUser.name, email: editUser.email, role: editUser.role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("User updated successfully");
        setOpenEditDialog(false);
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/users/delete/${userToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("User deleted successfully");
        setOpenDeleteDialog(false);
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TableContainer sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(user._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {Array.from({ length: Math.max(0, rowsPerPage - users.length) }).map((_, index) => (
              <TableRow
                key={`empty-${index}`}
                sx={{
                  height: "40px",
                  "&:nth-of-type(odd)": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <TableCell colSpan={isAdmin ? 4 : 3} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editUser?.name || ""}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editUser?.email || ""}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={editUser?.role || ""}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

UserList.propTypes = {
  role: PropTypes.string.isRequired,
};

export default UserList;
