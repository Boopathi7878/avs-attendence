import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Clock, Save, Calendar, Users, Filter } from 'lucide-react';
import { toast } from 'sonner';
import type { Student, AttendanceRecord } from '../App';

interface AttendanceMarkingProps {
  students: Student[];
  onMarkAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  currentUser: string;
}

export function AttendanceMarking({ students, onMarkAttendance, currentUser }: AttendanceMarkingProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  // Available courses
  const courses = [
    'Software Testing And Automation',
    'Distributed Computing',
    'Compiler Design',
    'Computer Networks',
    'Cyber Security',
    'Cryptography and CyberSecurity',
  ];

  const handleAttendanceChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const newAttendanceData: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    filteredStudents.forEach(student => {
      newAttendanceData[student.id] = status;
    });
    setAttendanceData(prev => ({ ...prev, ...newAttendanceData }));
  };

  const handleSubmit = () => {
    if (!selectedCourse) {
      toast.error('Please select a course before marking attendance');
      return;
    }

    const records: Omit<AttendanceRecord, 'id'>[] = [];
    
    Object.entries(attendanceData).forEach(([studentId, status]) => {
      records.push({
        studentId,
        date: selectedDate,
        status,
        course: selectedCourse,
        markedBy: currentUser
      });
    });

    if (records.length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    onMarkAttendance(records);
    setAttendanceData({});
    toast.success(`Attendance marked for ${records.length} students`);
  };

  const filteredStudents = students.filter(student => {
  if (filterStatus === 'all') return true;
  
  const status = attendanceData[student.id]; // e.g., "Present"
  
  // Convert both to lowercase for comparison
  return status?.toLowerCase() === filterStatus;
});

  const getStatusCount = (status: 'Present' | 'Absent' | 'Late') => {
    return Object.values(attendanceData).filter(s => s === status).length;
  };

  const totalMarked = Object.keys(attendanceData).length;
  const presentCount = getStatusCount('Present');
  const absentCount = getStatusCount('Absent');
  const lateCount = getStatusCount('Late');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <div className="text-xl sm:text-2xl text-blue-900">Mark Attendance</div>
          <div className="text-gray-600 text-sm sm:text-base">Record daily attendance for students</div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <span className="text-blue-900 text-sm sm:text-base">{new Date(selectedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-blue-200">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-blue-900 text-base sm:text-lg">Attendance Settings</CardTitle>
          <CardDescription className="text-sm">Configure date and course for attendance marking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-blue-200 focus:border-blue-500 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course/Subject</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500 h-12">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-blue-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('Present')}
              className="border-green-200 text-green-700 hover:bg-green-50 h-10 justify-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('Absent')}
              className="border-red-200 text-red-700 hover:bg-red-50 h-10 justify-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Mark All Absent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAttendanceData({})}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 h-10 justify-center"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {totalMarked > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>Summary:</strong> {totalMarked} students marked - 
            {presentCount > 0 && ` ${presentCount} Present`}
            {absentCount > 0 && ` ${absentCount} Absent`}
            {lateCount > 0 && ` ${lateCount} Late`}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className={`h-8 text-xs ${filterStatus === 'all' ? 'bg-blue-600' : 'border-blue-200 text-blue-700'}`}
          >
            All ({students.length})
          </Button>
          <Button
            variant={filterStatus === 'present' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('present')}
            className={`h-8 text-xs ${filterStatus === 'present' ? 'bg-green-600' : 'border-green-200 text-green-700'}`}
          >
            Present ({presentCount})
          </Button>
          <Button
            variant={filterStatus === 'absent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('absent')}
            className={`h-8 text-xs ${filterStatus === 'absent' ? 'bg-red-600' : 'border-red-200 text-red-700'}`}
          >
            Absent ({absentCount})
          </Button>
          <Button
            variant={filterStatus === 'late' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('late')}
            className={`h-8 text-xs ${filterStatus === 'late' ? 'bg-orange-600' : 'border-orange-200 text-orange-700'}`}
          >
            Late ({lateCount})
          </Button>
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredStudents.map((student) => {
          const currentStatus = attendanceData[student.id];
          
          return (
            <Card key={student.id} className="border-blue-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
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

                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <Button
                      variant={currentStatus === 'Present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'Present')}
                      className={`h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none ${currentStatus === 'Present' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Present</span>
                    </Button>
                    <Button
                      variant={currentStatus === 'Late' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'Late')}
                      className={`h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none ${currentStatus === 'Late' 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'}`}
                    >
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Late</span>
                    </Button>
                    <Button
                      variant={currentStatus === 'Absent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, 'Absent')}
                      className={`h-8 px-2 sm:px-3 text-xs flex-1 sm:flex-none ${currentStatus === 'Absent' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'border-red-200 text-red-700 hover:bg-red-50'}`}
                    >
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Absent</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-500">No students found for the selected filter</div>
        </div>
      )}

      {/* Submit Button */}
      {totalMarked > 0 && (
        <div className="sticky bottom-4">
          <Card className="border-blue-200 bg-white shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  {totalMarked} students marked for {selectedCourse || 'selected course'}
                </div>
                <Button 
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 h-10 w-full sm:w-auto"
                  disabled={!selectedCourse}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}