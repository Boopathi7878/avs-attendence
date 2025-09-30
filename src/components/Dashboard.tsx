import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Users, CheckCircle, XCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import type { Student, AttendanceRecord } from '../App';

interface DashboardProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

export function Dashboard({ students, attendanceRecords }: DashboardProps) {
  // Calculate statistics
  const totalStudents = students.length;
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(record => record.date === today);
  
  const presentToday = todayAttendance.filter(record => record.status === 'Present').length;
  const absentToday = todayAttendance.filter(record => record.status === 'Absent').length;
  const lateToday = todayAttendance.filter(record => record.status === 'Late').length;
  
  const attendancePercentageToday = totalStudents > 0 ? 
    Math.round((presentToday / totalStudents) * 100) : 0;

  // Calculate overall attendance statistics
  const calculateStudentAttendance = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(record => record.studentId === studentId);
    if (studentRecords.length === 0) return 0;
    const presentRecords = studentRecords.filter(record => record.status === 'Present' || record.status === 'Late');
    return Math.round((presentRecords.length / studentRecords.length) * 100);
  };

  const allAttendancePercentages = students.map(student => calculateStudentAttendance(student.id));
  const averageAttendance = allAttendancePercentages.length > 0 ? 
    Math.round(allAttendancePercentages.reduce((sum, percentage) => sum + percentage, 0) / allAttendancePercentages.length) : 0;
  
  const highestAttendance = Math.max(...allAttendancePercentages, 0);
  const lowestAttendance = Math.min(...allAttendancePercentages, 100);

  // Recent attendance activity
  const recentRecords = attendanceRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-blue-800">Total Students</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-blue-900">{totalStudents}</div>
            <p className="text-xs text-blue-600 mt-1 hidden sm:block">
              Enrolled in CSE Department
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-green-800">Present Today</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-green-900">{presentToday}</div>
            <p className="text-xs text-green-600 mt-1">
              {attendancePercentageToday}%
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-red-800">Absent Today</CardTitle>
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-red-900">{absentToday}</div>
            <p className="text-xs text-red-600 mt-1 hidden sm:block">
              Requires follow-up
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm text-orange-800">Late Today</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl text-orange-900">{lateToday}</div>
            <p className="text-xs text-orange-600 mt-1 hidden sm:block">
              Punctuality concerns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-blue-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Overall Attendance Statistics</span>
              <span className="sm:hidden">Attendance Stats</span>
            </CardTitle>
            <CardDescription className="text-sm">Semester performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Attendance</span>
                <span className="text-base sm:text-lg text-blue-900">{averageAttendance}%</span>
              </div>
              <Progress value={averageAttendance} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-base sm:text-lg text-green-800">{highestAttendance}%</div>
                <div className="text-xs text-green-600">Highest</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-base sm:text-lg text-red-800">{lowestAttendance}%</div>
                <div className="text-xs text-red-600">Lowest</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">Latest attendance records</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-2 sm:space-y-3">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => {
                  const student = students.find(s => s.id === record.studentId);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm truncate">{student?.name || 'Unknown Student'}</div>
                          <div className="text-xs text-gray-500">{record.date}</div>
                        </div>
                      </div>
                      <Badge 
                        variant={record.status === 'Present' ? 'default' : 
                                record.status === 'Late' ? 'secondary' : 'destructive'}
                        className={`text-xs flex-shrink-0 ${record.status === 'Present' ? 'bg-green-100 text-green-800 border-green-200' :
                                  record.status === 'Late' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                  'bg-red-100 text-red-800 border-red-200'}`}
                      >
                        {record.status}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No attendance records yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance Overview */}
      <Card className="border-blue-200">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-blue-900 text-base sm:text-lg">Today's Attendance Overview</CardTitle>
          <CardDescription className="text-sm">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {todayAttendance.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xl sm:text-2xl text-green-800">{presentToday}</div>
                <div className="text-xs sm:text-sm text-green-600">Present</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-xl sm:text-2xl text-orange-800">{lateToday}</div>
                <div className="text-xs sm:text-sm text-orange-600">Late</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-xl sm:text-2xl text-red-800">{absentToday}</div>
                <div className="text-xs sm:text-sm text-red-600">Absent</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm sm:text-base">No attendance marked for today</p>
              <p className="text-xs sm:text-sm mt-1">Go to Attendance tab to mark today's attendance</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}