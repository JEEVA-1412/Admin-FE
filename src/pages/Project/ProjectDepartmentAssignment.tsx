// // src/pages/Projects/ProjectDepartmentAssignment.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CardHeader,
//   TextField,
//   Button,
//   Alert,
//   Box,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem
// } from "@mui/material";
// import {
//   GroupAdd as GroupAddIcon,
//   Delete as DeleteIcon,
//   ArrowBack as BackIcon,
//   People as PeopleIcon
// } from "@mui/icons-material";
// import { useParams, useNavigate } from "react-router-dom";

// interface Department {
//   dept_id: number;
//   name: string;
//   description?: string;
// }

// interface DepartmentAssignment {
//   dept_id: number;
//   department_name: string;
//   description?: string;
//   assigned_employees: number;
//   total_employees: number;
//   roles_used: string;
// }

// const ProjectDepartmentAssignment: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const projectId = parseInt(id || "0");

//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [departmentAssignments, setDepartmentAssignments] = useState<DepartmentAssignment[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);
//   const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; department: DepartmentAssignment | null }>({
//     open: false,
//     department: null
//   });

//   const [assignmentData, setAssignmentData] = useState({
//     project_id: projectId,
//     department_id: 0,
//     role_template: "",
//     progress: "Not Started",
//     remarks: ""
//   });

//   const showAlert = (type: "success" | "error" | "warning", message: string) => {
//     setAlert({ type, message });
//     setTimeout(() => setAlert(null), 5000);
//   };

//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/departments", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Departments:", result);
        
//         if (result.success) {
//           setDepartments(result.data || []);
//         } else if (Array.isArray(result)) {
//           setDepartments(result);
//         } else {
//           setDepartments(result.data || []);
//         }
//       } else {
//         throw new Error("Failed to fetch departments");
//       }
//     } catch (error) {
//       console.error("Error fetching departments:", error);
//       showAlert("error", "Failed to load departments");
//     }
//   };

//   const fetchDepartmentAssignments = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:5000/api/project-assignments/project/${projectId}/departments`,
//         {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Department assignments:", result);
//         if (result.success) {
//           setDepartmentAssignments(result.data || []);
//         } else {
//           setDepartmentAssignments([]);
//         }
//       } else {
//         setDepartmentAssignments([]);
//       }
//     } catch (error) {
//       console.error("Error fetching department assignments:", error);
//       setDepartmentAssignments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (projectId) {
//       fetchDepartments();
//       fetchDepartmentAssignments();
//     }
//   }, [projectId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (assignmentData.department_id === 0) {
//       showAlert("warning", "Please select a department");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/project-assignments/department", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(assignmentData)
//       });

//       const result = await response.json();
//       console.log("Department assignment response:", result);

//       if (result.success) {
//         showAlert("success", 
//           `Successfully assigned ${result.data.assigned_count} employees from department to project!`
//         );
//         setAssignmentData(prev => ({
//           ...prev,
//           department_id: 0,
//           role_template: "",
//           remarks: ""
//         }));
//         fetchDepartmentAssignments();
//       } else {
//         throw new Error(result.message || "Failed to assign department");
//       }
//     } catch (error) {
//       console.error("Error assigning department:", error);
//       showAlert("error", error instanceof Error ? error.message : "Failed to assign department to project");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleRemoveDepartment = async (deptId: number) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:5000/api/project-assignments/project/${projectId}/department/${deptId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       const result = await response.json();
//       console.log("Remove department response:", result);

//       if (result.success) {
//         showAlert("success", 
//           `Removed ${result.data.removed_assignments} assignments for department`
//         );
//         fetchDepartmentAssignments();
//       } else {
//         throw new Error(result.message || "Failed to remove department");
//       }
//     } catch (error) {
//       console.error("Error removing department:", error);
//       showAlert("error", error instanceof Error ? error.message : "Failed to remove department from project");
//     } finally {
//       setDeleteDialog({ open: false, department: null });
//     }
//   };

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {alert && (
//         <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
//           {alert.message}
//         </Alert>
//       )}

//       {/* Header */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
//         <Box>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => navigate(`/admin/projects/${projectId}`)}
//               startIcon={<BackIcon />}
//               sx={{ mr: 2 }}
//             >
//               Back to Project
//             </Button>
//             <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
//               Assign Departments
//             </Typography>
//           </Box>
//           <Typography variant="body1" color="text.secondary">
//             Assign entire departments to project #{projectId} - all employees will be automatically assigned
//           </Typography>
//         </Box>
//       </Box>

//       <Grid container spacing={3}>
//         {/* Department Assignment Form */}
//         <Grid size={{ xs: 12, lg: 5 }}>
//           <Card>
//             <CardHeader 
//               title="Assign Department" 
//               subheader="All employees in the department will be assigned to this project"
//             />
//             <CardContent>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       fullWidth
//                       select
//                       label="Select Department"
//                       name="department_id"
//                       value={assignmentData.department_id}
//                       onChange={(e) => setAssignmentData(prev => ({ 
//                         ...prev, 
//                         department_id: parseInt(e.target.value) 
//                       }))}
//                       required
//                     >
//                       <MenuItem value={0}>Select a Department</MenuItem>
//                       {departments.map(dept => (
//                         <MenuItem key={dept.dept_id} value={dept.dept_id}>
//                           {dept.name}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </Grid>

//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       fullWidth
//                       label="Default Role Template"
//                       name="role_template"
//                       value={assignmentData.role_template}
//                       onChange={(e) => setAssignmentData(prev => ({ 
//                         ...prev, 
//                         role_template: e.target.value 
//                       }))}
//                       placeholder="e.g., Developer, Tester, Designer"
//                       helperText="Leave empty to use employee's designation as role"
//                     />
//                   </Grid>

//                   <Grid size={{ xs: 12 }}>
//                     <TextField
//                       fullWidth
//                       label="Remarks & Notes"
//                       name="remarks"
//                       value={assignmentData.remarks}
//                       onChange={(e) => setAssignmentData(prev => ({ 
//                         ...prev, 
//                         remarks: e.target.value 
//                       }))}
//                       multiline
//                       rows={3}
//                       placeholder="Department-specific instructions or notes..."
//                     />
//                   </Grid>

//                   <Grid size={{ xs: 12 }}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       fullWidth
//                       size="large"
//                       disabled={submitting || assignmentData.department_id === 0}
//                       startIcon={submitting ? <CircularProgress size={20} /> : <GroupAddIcon />}
//                     >
//                       {submitting ? "Assigning Department..." : "Assign Entire Department"}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Assigned Departments */}
//         <Grid size={{ xs: 12, lg: 7 }}>
//           <Card>
//             <CardHeader
//               title={
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap', gap: 1 }}>
//                   <Typography variant="h6">Assigned Departments</Typography>
//                   <Chip 
//                     label={`${departmentAssignments.filter(dept => dept.assigned_employees > 0).length} departments`} 
//                     color="primary" 
//                   />
//                 </Box>
//               }
//             />
//             <CardContent>
//               {loading ? (
//                 <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//                   <CircularProgress />
//                   <Typography variant="body1" sx={{ ml: 2 }}>
//                     Loading department assignments...
//                   </Typography>
//                 </Box>
//               ) : departmentAssignments.filter(dept => dept.assigned_employees > 0).length > 0 ? (
//                 <TableContainer component={Paper} elevation={0}>
//                   <Table>
//                     <TableHead sx={{ bgcolor: 'grey.50' }}>
//                       <TableRow>
//                         <TableCell><strong>Department</strong></TableCell>
//                         <TableCell><strong>Employees</strong></TableCell>
//                         <TableCell><strong>Roles</strong></TableCell>
//                         <TableCell><strong>Actions</strong></TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {departmentAssignments
//                         .filter(dept => dept.assigned_employees > 0)
//                         .map((department) => (
//                         <TableRow key={department.dept_id} hover>
//                           <TableCell>
//                             <Box>
//                               <Typography variant="body1" fontWeight="medium">
//                                 {department.department_name}
//                               </Typography>
//                               {department.description && (
//                                 <Typography variant="body2" color="text.secondary">
//                                   {department.description}
//                                 </Typography>
//                               )}
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Chip 
//                               label={`${department.assigned_employees}/${department.total_employees}`}
//                               color={
//                                 department.assigned_employees === 0 ? "default" :
//                                 department.assigned_employees === department.total_employees ? "success" : "warning"
//                               }
//                               variant="outlined"
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <Typography 
//                               variant="body2" 
//                               color="text.secondary"
//                               sx={{ 
//                                 maxWidth: 200,
//                                 overflow: 'hidden',
//                                 textOverflow: 'ellipsis',
//                                 whiteSpace: 'nowrap'
//                               }}
//                             >
//                               {department.roles_used || "No specific roles"}
//                             </Typography>
//                           </TableCell>
//                           <TableCell>
//                             <Button
//                               size="small"
//                               color="error"
//                               startIcon={<DeleteIcon />}
//                               onClick={() => setDeleteDialog({ open: true, department })}
//                               disabled={department.assigned_employees === 0}
//                             >
//                               Remove
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               ) : (
//                 <Box sx={{ textAlign: "center", py: 4 }}>
//                   <PeopleIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     No departments assigned
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Use the form to assign departments to this project
//                   </Typography>
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialog.open}
//         onClose={() => setDeleteDialog({ open: false, department: null })}
//       >
//         <DialogTitle>Remove Department</DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to remove <strong>{deleteDialog.department?.department_name}</strong> from this project?
//             {deleteDialog.department && deleteDialog.department.assigned_employees > 0 && (
//               <> This will remove all {deleteDialog.department.assigned_employees} employee assignments from this department.</>
//             )}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialog({ open: false, department: null })}>
//             Cancel
//           </Button>
//           <Button
//             onClick={() => deleteDialog.department && handleRemoveDepartment(deleteDialog.department.dept_id)}
//             color="error"
//             variant="contained"
//           >
//             Remove Department
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default ProjectDepartmentAssignment;