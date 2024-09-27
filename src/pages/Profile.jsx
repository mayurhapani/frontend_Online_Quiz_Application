import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { TextField, Button, Box, Typography } from "@mui/material";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(profileData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={profileData.name || ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mt: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        value={profileData.email || ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mt: 2 }}
      />
      <TextField
        label="Role"
        name="role"
        value={profileData.role || ""}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mt: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
};

export default Profile;
