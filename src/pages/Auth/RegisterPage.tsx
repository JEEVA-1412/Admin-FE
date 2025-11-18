// // src/pages/Auth/RegisterPage.tsx
// import React, { useState } from 'react';
// import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress, InputAdornment, IconButton, MenuItem } from '@mui/material';
// import { Visibility, VisibilityOff, Email, Lock, Person, Business } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface RegisterForm {
//   username: string;
//   email: string;
//   password: string;
//   role: 'ADMIN' | 'EMPLOYEE';
// }

// const RegisterPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<RegisterForm>({ username: '', email: '', password: '', role: 'EMPLOYEE' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//     setSuccess('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       await axios.post("http://localhost:5000/api/auth/register", formData);
//       setSuccess('Registration successful! Redirecting to login...');
//       setTimeout(() => navigate('/login'), 1500);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container component="main" maxWidth="sm">
//       <Paper sx={{ padding: 4, mt: 6 }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Business sx={{ fontSize: 48 }} />
//           <Typography variant="h4">Create Account</Typography>
//         </Box>

//         {error && <Alert severity="error">{error}</Alert>}
//         {success && <Alert severity="success">{success}</Alert>}

//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           <TextField
//             label="Username"
//             name="username"
//             fullWidth
//             required
//             value={formData.username}
//             onChange={handleChange}
//             InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Email"
//             name="email"
//             fullWidth
//             required
//             value={formData.email}
//             onChange={handleChange}
//             InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Password"
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             fullWidth
//             required
//             value={formData.password}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShowPassword(!showPassword)}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             select
//             label="Role"
//             name="role"
//             fullWidth
//             value={formData.role}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           >
//             <MenuItem value="ADMIN">Admin</MenuItem>
//             <MenuItem value="EMPLOYEE">Employee</MenuItem>
//           </TextField>

//           <Button type="submit" variant="contained" fullWidth disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : 'Register'}
//           </Button>
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default RegisterPage;
