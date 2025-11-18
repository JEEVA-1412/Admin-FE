// // src/pages/Dashboard/HRDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Paper,
//   LinearProgress,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import {
//   People,
//   Business,
//   AttachMoney,
//   CalendarToday,
//   Assignment,
//   VideoCall,
//   TrendingUp,
//   Notifications,
//   ArrowForward,
//   Person,
//   Groups,
//   Work,
//   Schedule,
//   RequestQuote,
//   Diversity3
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from '../../component/common/Sidebar';

// // Types
// interface HRDashboardStats {
//   totalEmployees: number;
//   myDepartmentEmployees: number;
//   pendingRequests: number;
//   processedPayroll: number;
//   upcomingMeetings: number;
//   pendingLeaves: number;
//   activeEmployees: number;
// }

// interface RecentActivity {
//   id: number;
//   type: 'request' | 'meeting' | 'payroll' | 'employee' | 'leave';
//   title: string;
//   description: string;
//   time: string;
//   status?: 'pending' | 'completed' | 'in-progress' | 'upcoming' | 'approved' | 'rejected';
// }

// interface QuickStats {
//   label: string;
//   value: number;
//   icon: React.ReactNode;
//   color: string;
//   path: string;
//   change?: number;
// }

// const MotionCard = motion(Card);
// const MotionPaper = motion(Paper);

// const HRDashboard: React.FC = () => {
//   const [stats, setStats] = useState<HRDashboardStats>({
//     totalEmployees: 0,
//     myDepartmentEmployees: 0,
//     pendingRequests: 0,
//     processedPayroll: 0,
//     upcomingMeetings: 0,
//     pendingLeaves: 0,
//     activeEmployees: 0
//   });
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const token = localStorage.getItem('token');
      
//       // Fetch HR-specific data
//       const [
//         employeesRes, 
//         requestsRes, 
//         payrollRes, 
//         meetingsRes,
//         leavesRes,
//         userProfileRes
//       ] = await Promise.all([
//         axios.get('http://localhost:5000/api/hr/employees', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/requests', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/payroll', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/meetings', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/leaves', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const employees = employeesRes.data || [];
//       const requests = requestsRes.data?.data || requestsRes.data || [];
//       const payrolls = payrollRes.data || [];
//       const meetings = meetingsRes.data || [];
//       const leaves = leavesRes.data || [];
//       const userProfile = userProfileRes.data;

//       // Filter employees for HR's department
//       const myDepartmentEmployees = employees.filter((emp: any) => 
//         emp.department_name === userProfile?.department_name
//       );

//       const activeEmployees = myDepartmentEmployees.filter((emp: any) => emp.is_active).length;
//       const pendingRequests = requests.filter((req: any) => req.status === 'PENDING').length;
//       const processedPayroll = payrolls.filter((payroll: any) => 
//         payroll.processed_by === userProfile?.username
//       ).reduce((sum: number, payroll: any) => sum + (payroll.total || 0), 0);
      
//       const upcomingMeetings = meetings.filter((meeting: any) => 
//         new Date(meeting.date_time) > new Date() && 
//         meeting.department_name === userProfile?.department_name
//       ).length;

//       const pendingLeaves = leaves.filter((leave: any) => 
//         leave.status === 'PENDING' && 
//         leave.department_name === userProfile?.department_name
//       ).length;

//       setStats({
//         totalEmployees: employees.length,
//         myDepartmentEmployees: myDepartmentEmployees.length,
//         pendingRequests,
//         processedPayroll,
//         upcomingMeetings,
//         pendingLeaves,
//         activeEmployees
//       });

//       // Generate recent activities from HR-specific data
//       const activities: RecentActivity[] = [];

//       // Add recent requests from HR's department
//       requests
//         .filter((req: any) => !req.department_name || req.department_name === userProfile?.department_name)
//         .slice(0, 2)
//         .forEach((req: any) => {
//           activities.push({
//             id: req.request_id,
//             type: 'request',
//             title: `${req.category} Request`,
//             description: `From ${req.employee_name || 'Employee'}`,
//             time: formatTimeAgo(req.created_at),
//             status: req.status === 'PENDING' ? 'pending' : 
//                     req.status === 'IN_PROGRESS' ? 'in-progress' : 'completed'
//           });
//         });

//       // Add upcoming meetings for HR's department
//       meetings
//         .filter((meeting: any) => 
//           meeting.department_name === userProfile?.department_name &&
//           new Date(meeting.date_time) > new Date()
//         )
//         .slice(0, 2)
//         .forEach((meeting: any) => {
//           activities.push({
//             id: meeting.meeting_id,
//             type: 'meeting',
//             title: meeting.title,
//             description: `Scheduled for ${formatDateTime(meeting.date_time)}`,
//             time: formatTimeAgo(meeting.created_at),
//             status: 'upcoming'
//           });
//         });

//       // Add payroll processed by this HR
//       payrolls
//         .filter((payroll: any) => payroll.processed_by === userProfile?.username)
//         .slice(0, 1)
//         .forEach((payroll: any) => {
//           activities.push({
//             id: payroll.payroll_id,
//             type: 'payroll',
//             title: 'Payroll Processed',
//             description: `For ${payroll.employee_name} - ₹${payroll.total?.toLocaleString()}`,
//             time: formatTimeAgo(payroll.created_at),
//             status: 'completed'
//           });
//         });

//       // Add pending leave requests
//       leaves
//         .filter((leave: any) => 
//           leave.status === 'PENDING' && 
//           leave.department_name === userProfile?.department_name
//         )
//         .slice(0, 1)
//         .forEach((leave: any) => {
//           activities.push({
//             id: leave.leave_id,
//             type: 'leave',
//             title: 'Leave Request Pending',
//             description: `${leave.employee_name} - ${leave.type} (${calculateLeaveDays(leave.start_date, leave.end_date)} days)`,
//             time: formatTimeAgo(leave.created_at),
//             status: 'pending'
//           });
//         });

//       setRecentActivities(activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6));

//     } catch (error: any) {
//       console.error('Error fetching HR dashboard data:', error);
//       setError(error.response?.data?.message || 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins} minutes ago`;
//     if (diffHours < 24) return `${diffHours} hours ago`;
//     if (diffDays === 1) return '1 day ago';
//     return `${diffDays} days ago`;
//   };

//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const calculateLeaveDays = (startDate: string, endDate: string) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const timeDiff = end.getTime() - start.getTime();
//     return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
//   };

//   const quickStats: QuickStats[] = [
//     {
//       label: 'My Department',
//       value: stats.myDepartmentEmployees,
//       icon: <Groups sx={{ fontSize: 24 }} />,
//       color: '#667eea',
//       path: '/hr/employees',
//       change: Math.round((stats.activeEmployees / stats.myDepartmentEmployees) * 100)
//     },
//     {
//       label: 'Pending Requests',
//       value: stats.pendingRequests,
//       icon: <Assignment sx={{ fontSize: 24 }} />,
//       color: '#f093fb',
//       path: '/hr/requests'
//     },
//     {
//       label: 'Processed Payroll',
//       value: stats.processedPayroll,
//       icon: <AttachMoney sx={{ fontSize: 24 }} />,
//       color: '#4ecdc4',
//       path: '/hr/payroll'
//     },
//     {
//       label: 'Upcoming Meetings',
//       value: stats.upcomingMeetings,
//       icon: <VideoCall sx={{ fontSize: 24 }} />,
//       color: '#45b7d1',
//       path: '/hr/meetings'
//     },
//     {
//       label: 'Pending Leaves',
//       value: stats.pendingLeaves,
//       icon: <CalendarToday sx={{ fontSize: 24 }} />,
//       color: '#ff6b6b',
//       path: '/hr/leaves'
//     },
//     {
//       label: 'Total Employees',
//       value: stats.totalEmployees,
//       icon: <People sx={{ fontSize: 24 }} />,
//       color: '#96ceb4',
//       path: '/hr/employees'
//     }
//   ];

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'request': return <Assignment color="primary" />;
//       case 'meeting': return <VideoCall color="secondary" />;
//       case 'payroll': return <AttachMoney color="success" />;
//       case 'employee': return <Person color="info" />;
//       case 'leave': return <CalendarToday color="warning" />;
//       default: return <Notifications color="action" />;
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'pending': return 'warning';
//       case 'completed': return 'success';
//       case 'in-progress': return 'info';
//       case 'upcoming': return 'secondary';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const handleQuickAction = (path: string) => {
//     navigate(path);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex" }}>
//         <Sidebar />
//         <Box sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//           <CircularProgress size={60} thickness={4} />
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: "flex" }}>
//       <Sidebar />
//       <Box sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
//         {/* Header Section */}
//         <MotionPaper
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           sx={{
//             p: 3,
//             mb: 3,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             borderRadius: 3
//           }}
//         >
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//             <Box>
//               <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                 HR Dashboard
//               </Typography>
//               <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
//                 Manage your department and employee activities
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Diversity3 sx={{ fontSize: 32, opacity: 0.9 }} />
//             </Box>
//           </Box>
//         </MotionPaper>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
//             {error}
//           </Alert>
//         )}

//         {/* Quick Stats Grid */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {quickStats.map((stat, index) => (
//             <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
//               <MotionCard
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 sx={{
//                   borderRadius: 3,
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
//                   }
//                 }}
//                 onClick={() => handleQuickAction(stat.path)}
//               >
//                 <CardContent sx={{ p: 3, textAlign: 'center' }}>
//                   <Box
//                     sx={{
//                       width: 60,
//                       height: 60,
//                       borderRadius: '50%',
//                       background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}99 100%)`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       margin: '0 auto 16px',
//                       color: 'white'
//                     }}
//                   >
//                     {stat.icon}
//                   </Box>
//                   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
//                     {stat.label.includes('Payroll') ? formatCurrency(stat.value) : stat.value}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
//                     {stat.label}
//                   </Typography>
//                   {stat.change && (
//                     <Chip
//                       label={`${stat.change}% active`}
//                       color="success"
//                       size="small"
//                       variant="outlined"
//                     />
//                   )}
//                 </CardContent>
//               </MotionCard>
//             </Grid>
//           ))}
//         </Grid>

//         <Grid container spacing={3}>
//           {/* Recent Activities */}
//           <Grid size={{ xs: 12, lg: 8 }}>
//             <MotionPaper
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                 background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
//               }}
//             >
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//                   Recent Activities
//                 </Typography>
//                 <Button 
//                   endIcon={<ArrowForward />}
//                   onClick={() => handleQuickAction('/hr/requests')}
//                 >
//                   View All
//                 </Button>
//               </Box>

//               <List sx={{ maxHeight: 400, overflow: 'auto' }}>
//                 {recentActivities.length > 0 ? (
//                   recentActivities.map((activity, index) => (
//                     <MotionPaper
//                       key={activity.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
//                     >
//                       <ListItem sx={{ py: 2 }}>
//                         <ListItemIcon>
//                           {getActivityIcon(activity.type)}
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                               <Typography variant="subtitle1" fontWeight="500">
//                                 {activity.title}
//                               </Typography>
//                               {activity.status && (
//                                 <Chip
//                                   label={activity.status.replace('-', ' ').toUpperCase()}
//                                   color={getStatusColor(activity.status)}
//                                   size="small"
//                                 />
//                               )}
//                             </Box>
//                           }
//                           secondary={
//                             <Box sx={{ mt: 1 }}>
//                               <Typography variant="body2" color="textSecondary">
//                                 {activity.description}
//                               </Typography>
//                               <Typography variant="caption" color="textSecondary">
//                                 {activity.time}
//                               </Typography>
//                             </Box>
//                           }
//                         />
//                       </ListItem>
//                     </MotionPaper>
//                   ))
//                 ) : (
//                   <Box sx={{ textAlign: 'center', py: 4 }}>
//                     <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                     <Typography variant="h6" color="textSecondary">
//                       No recent activities
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       Activities will appear here as they happen
//                     </Typography>
//                   </Box>
//                 )}
//               </List>
//             </MotionPaper>
//           </Grid>

//           {/* HR Tasks & Quick Actions */}
//           <Grid size={{ xs: 12, lg: 4 }}>
//             <MotionPaper
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                 background: 'linear-gradient(135deg, #a8e6cf 0%, #3d5a80 100%)',
//                 color: 'white'
//               }}
//             >
//               <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
//                 HR Tasks Overview
//               </Typography>

//               <Box sx={{ mb: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Request Resolution</Typography>
//                   <Typography variant="body2" fontWeight="bold">
//                     {stats.pendingRequests > 0 ? 'Pending' : 'Completed'}
//                   </Typography>
//                 </Box>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={stats.pendingRequests > 0 ? 50 : 100} 
//                   sx={{ 
//                     height: 8, 
//                     borderRadius: 4,
//                     backgroundColor: 'rgba(255,255,255,0.3)',
//                     '& .MuiLinearProgress-bar': {
//                       backgroundColor: stats.pendingRequests > 0 ? 'orange' : 'white'
//                     }
//                   }}
//                 />
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Leave Approvals</Typography>
//                   <Typography variant="body2" fontWeight="bold">
//                     {stats.pendingLeaves} pending
//                   </Typography>
//                 </Box>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={stats.pendingLeaves > 0 ? 30 : 100} 
//                   sx={{ 
//                     height: 8, 
//                     borderRadius: 4,
//                     backgroundColor: 'rgba(255,255,255,0.3)',
//                     '& .MuiLinearProgress-bar': {
//                       backgroundColor: stats.pendingLeaves > 0 ? 'orange' : 'white'
//                     }
//                   }}
//                 />
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2">Team Engagement</Typography>
//                   <Typography variant="body2" fontWeight="bold">
//                     {Math.round((stats.activeEmployees / stats.myDepartmentEmployees) * 100)}%
//                   </Typography>
//                 </Box>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={(stats.activeEmployees / stats.myDepartmentEmployees) * 100} 
//                   sx={{ 
//                     height: 8, 
//                     borderRadius: 4,
//                     backgroundColor: 'rgba(255,255,255,0.3)',
//                     '& .MuiLinearProgress-bar': {
//                       backgroundColor: 'white'
//                     }
//                   }}
//                 />
//               </Box>

//               <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
//                 <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
//                   Quick Actions
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                   <Button 
//                     variant="contained" 
//                     size="small"
//                     onClick={() => handleQuickAction('/hr/employees/new')}
//                     sx={{ 
//                       backgroundColor: 'rgba(255,255,255,0.9)',
//                       color: 'primary.main',
//                       '&:hover': { backgroundColor: 'white' }
//                     }}
//                   >
//                     Add Employee
//                   </Button>
//                   <Button 
//                     variant="contained" 
//                     size="small"
//                     onClick={() => handleQuickAction('/hr/meetings/create')}
//                     sx={{ 
//                       backgroundColor: 'rgba(255,255,255,0.9)',
//                       color: 'primary.main',
//                       '&:hover': { backgroundColor: 'white' }
//                     }}
//                   >
//                     Schedule Meeting
//                   </Button>
//                   <Button 
//                     variant="contained" 
//                     size="small"
//                     onClick={() => handleQuickAction('/hr/payroll/new')}
//                     sx={{ 
//                       backgroundColor: 'rgba(255,255,255,0.9)',
//                       color: 'primary.main',
//                       '&:hover': { backgroundColor: 'white' }
//                     }}
//                   >
//                     Process Payroll
//                   </Button>
//                 </Box>
//               </Box>
//             </MotionPaper>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default HRDashboard;