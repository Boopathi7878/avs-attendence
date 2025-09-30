import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Student, AttendanceRecord } from '../App';

interface ReportsProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

export function Reports({ students, attendanceRecords }: ReportsProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Get unique courses
  const courses = [...new Set(attendanceRecords.map(record => record.course))];

  // Calculate student attendance percentages
  const calculateStudentAttendance = (studentId: string, courseFilter?: string) => {
    let records = attendanceRecords.filter(record => record.studentId === studentId);
    
    if (courseFilter) {
      records = records.filter(record => record.course === courseFilter);
    }
    
    if (dateFrom) {
      records = records.filter(record => record.date >= dateFrom);
    }
    
    if (dateTo) {
      records = records.filter(record => record.date <= dateTo);
    }

    if (records.length === 0) return 0;
    
    const presentRecords = records.filter(record => record.status === 'Present' || record.status === 'Late');
    return Math.round((presentRecords.length / records.length) * 100);
  };

  // Generate student reports
  const studentReports = students.map(student => {
    const percentage = calculateStudentAttendance(student.id, selectedCourse !== 'all' ? selectedCourse : undefined);
    const totalClasses = attendanceRecords.filter(record => {
      let matches = record.studentId === student.id;
      if (selectedCourse !== 'all') matches = matches && record.course === selectedCourse;
      if (dateFrom) matches = matches && record.date >= dateFrom;
      if (dateTo) matches = matches && record.date <= dateTo;
      return matches;
    }).length;

    const presentClasses = attendanceRecords.filter(record => {
      let matches = record.studentId === student.id && (record.status === 'Present' || record.status === 'Late');
      if (selectedCourse !== 'all') matches = matches && record.course === selectedCourse;
      if (dateFrom) matches = matches && record.date >= dateFrom;
      if (dateTo) matches = matches && record.date <= dateTo;
      return matches;
    }).length;

    return {
      ...student,
      attendancePercentage: percentage,
      totalClasses,
      presentClasses,
      absentClasses: totalClasses - presentClasses
    };
  }).sort((a, b) => b.attendancePercentage - a.attendancePercentage);

  // Course-wise statistics
  const courseStats = courses.map(course => {
    const courseRecords = attendanceRecords.filter(record => record.course === course);
    const totalRecords = courseRecords.length;
    const presentRecords = courseRecords.filter(record => record.status === 'Present' || record.status === 'Late').length;
    const percentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    return {
      course,
      totalClasses: totalRecords,
      averageAttendance: percentage,
      totalStudents: new Set(courseRecords.map(r => r.studentId)).size
    };
  });

  // Overall statistics
  const totalStudents = students.length;
  const averageAttendance = studentReports.length > 0 ? 
    Math.round(studentReports.reduce((sum, student) => sum + student.attendancePercentage, 0) / studentReports.length) : 0;
  const highestAttendance = Math.max(...studentReports.map(s => s.attendancePercentage), 0);
  const lowestAttendance = Math.min(...studentReports.map(s => s.attendancePercentage), 100);

  // Chart data
  const attendanceDistribution = [
    { range: '90-100%', count: studentReports.filter(s => s.attendancePercentage >= 90).length, color: '#22c55e' },
    { range: '80-89%', count: studentReports.filter(s => s.attendancePercentage >= 80 && s.attendancePercentage < 90).length, color: '#84cc16' },
    { range: '70-79%', count: studentReports.filter(s => s.attendancePercentage >= 70 && s.attendancePercentage < 80).length, color: '#eab308' },
    { range: '60-69%', count: studentReports.filter(s => s.attendancePercentage >= 60 && s.attendancePercentage < 70).length, color: '#f97316' },
    { range: 'Below 60%', count: studentReports.filter(s => s.attendancePercentage < 60).length, color: '#ef4444' }
  ];

  // Export to CSV
  const exportToCSV = () => {
    const csvHeaders = ['Student_ID', 'Name', 'Department', 'Batch', 'Total_Classes', 'Present_Classes', 'Absent_Classes', 'Attendance_Percentage'];
    const csvData = studentReports.map(student => [
      student.studentId,
      student.name,
      student.department,
      student.batch,
      student.totalClasses,
      student.presentClasses,
      student.absentClasses,
      `${student.attendancePercentage}%`
    ]);

    const csvContent = [csvHeaders, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="text-xl sm:text-2xl text-blue-900">Reports & Analytics</div>
          <div className="text-gray-600 text-sm sm:text-base">Comprehensive attendance analysis and insights</div>
        </div>
        <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-blue-200">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-blue-900 text-base sm:text-lg">Report Filters</CardTitle>
          <CardDescription className="text-sm">Filter reports by student, course, and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="border-blue-200 h-12">
                  <SelectValue placeholder="All students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All students</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="border-blue-200 h-12">
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border-blue-200 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border-blue-200 h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-blue-800">Total Students</CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-blue-900">{totalStudents}</div>
            <p className="text-xs text-blue-600 mt-1 hidden sm:block">In CSE Department</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-green-800">Average</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-green-900">{averageAttendance}%</div>
            <p className="text-xs text-green-600 mt-1 hidden sm:block">Overall performance</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-emerald-800">Highest</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-emerald-900">{highestAttendance}%</div>
            <p className="text-xs text-emerald-600 mt-1 hidden sm:block">Best performer</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-red-800">Lowest</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-red-900">{lowestAttendance}%</div>
            <p className="text-xs text-red-600 mt-1 hidden sm:block">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-blue-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Attendance Distribution</span>
              <span className="sm:hidden">Distribution</span>
            </CardTitle>
            <CardDescription className="text-sm">Students by attendance percentage</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Attendance Categories</span>
              <span className="sm:hidden">Categories</span>
            </CardTitle>
            <CardDescription className="text-sm">Distribution of attendance ranges</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceDistribution.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="count"
                  label={({ range, count }) => `${range}: ${count}`}
                  labelStyle={{ fontSize: 12 }}
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Statistics */}
      {courses.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-blue-900 text-base sm:text-lg">Course-wise Statistics</CardTitle>
            <CardDescription className="text-sm">Attendance performance by course</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Course</TableHead>
                    <TableHead className="text-xs sm:text-sm">Classes</TableHead>
                    <TableHead className="text-xs sm:text-sm">Students</TableHead>
                    <TableHead className="text-xs sm:text-sm">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseStats.map((course) => (
                    <TableRow key={course.course}>
                      <TableCell className="text-xs sm:text-sm">{course.course}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{course.totalClasses}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{course.totalStudents}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={course.averageAttendance} className="h-2 flex-1" />
                          <span className="text-xs sm:text-sm min-w-[40px]">{course.averageAttendance}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Reports */}
      <Card className="border-blue-200">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-blue-900 text-base sm:text-lg">Individual Student Reports</CardTitle>
          <CardDescription className="text-sm">Detailed attendance records for each student</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {(selectedStudent !== 'all' ? studentReports.filter(s => s.id === selectedStudent) : studentReports).map((student) => (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-blue-100 rounded-lg gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={student.photo} alt={student.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-blue-900 text-sm sm:text-base truncate">{student.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{student.studentId}</div>
                    <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                      {student.batch}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 sm:flex sm:items-center sm:gap-6">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Total</div>
                    <div className="text-sm sm:text-lg">{student.totalClasses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Present</div>
                    <div className="text-sm sm:text-lg text-green-700">{student.presentClasses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Absent</div>
                    <div className="text-sm sm:text-lg text-red-700">{student.absentClasses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">Rate</div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <Progress value={student.attendancePercentage} className="h-2 w-full sm:w-16" />
                      <span className={`text-sm sm:text-lg ${student.attendancePercentage >= 75 ? 'text-green-700' : 'text-red-700'}`}>
                        {student.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {studentReports.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-500">No attendance records found</div>
              <div className="text-sm text-gray-400 mt-1">
                Start marking attendance to generate reports
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}