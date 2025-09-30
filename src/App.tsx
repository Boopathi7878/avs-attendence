import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceMarking } from './components/AttendanceMarking';
import { Reports } from './components/Reports';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';
import { Toaster } from './components/ui/sonner';
import { LogOut, Users, CheckSquare, BarChart3, UserPlus, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface Student {
  id: string;
  name: string;
  studentId: string;
  department: string;
  batch: string;
  email: string;
  phone: string;
  photo: string;
  enrollmentDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  course: string;
  markedBy: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Session management
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset session timer
  const resetSessionTimer = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear existing timers
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    // Hide warning
    setSessionWarning(false);
    
    // Set warning timer (show warning 5 minutes before logout)
    warningTimeoutRef.current = setTimeout(() => {
      setSessionWarning(true);
      setTimeRemaining(WARNING_TIME);
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            handleAutoLogout();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set auto logout timer
    sessionTimeoutRef.current = setTimeout(handleAutoLogout, SESSION_TIMEOUT);
  }, [isAuthenticated]);

  // Handle automatic logout
  const handleAutoLogout = useCallback(() => {
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    setIsAuthenticated(false);
    setCurrentUser('');
    setSessionWarning(false);
    localStorage.removeItem('avs_current_user');
    toast.error('Session expired. Please login again.');
  }, []);

  // Continue session (extend timer)
  const continueSession = useCallback(() => {
    resetSessionTimer();
    toast.success('Session extended successfully');
  }, [resetSessionTimer]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      if (!sessionWarning) {
        resetSessionTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Initial timer setup
    resetSessionTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isAuthenticated, sessionWarning, resetSessionTimer]);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('avs_current_user');
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }

    // Load students from localStorage
    const savedStudents = localStorage.getItem('avs_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Initialize with sample data
      const sampleStudents: Student[] = [
        {
          id: '1',
          name: 'Arjun Kumar',
          studentId: 'AVS2023001',
          department: 'Computer Science Engineering',
          batch: '2023-2027',
          email: 'arjun.kumar@avs.edu.in',
          phone: '+91 9876543210',
          photo: '',
          enrollmentDate: '2023-08-15'
        },
        {
          id: '2',
          name: 'Priya Sharma',
          studentId: 'AVS2023002',
          department: 'Computer Science Engineering',
          batch: '2023-2027',
          email: 'priya.sharma@avs.edu.in',
          phone: '+91 9876543211',
          photo: '',
          enrollmentDate: '2023-08-15'
        },
        {
          id: '3',
          name: 'Rahul Patel',
          studentId: 'AVS2023003',
          department: 'Computer Science Engineering',
          batch: '2023-2027',
          email: 'rahul.patel@avs.edu.in',
          phone: '+91 9876543212',
          photo: '',
          enrollmentDate: '2023-08-15'
        }
      ];
      setStudents(sampleStudents);
      localStorage.setItem('avs_students', JSON.stringify(sampleStudents));
    }

    // Load attendance records
    const savedAttendance = localStorage.getItem('avs_attendance');
    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance));
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('avs_current_user', username);
  };

  const handleLogout = () => {
    // Clear all session timers
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    setIsAuthenticated(false);
    setCurrentUser('');
    setSessionWarning(false);
    localStorage.removeItem('avs_current_user');
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: Date.now().toString()
    };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('avs_students', JSON.stringify(updatedStudents));
  };

  const updateStudent = (id: string, student: Omit<Student, 'id'>) => {
    const updatedStudents = students.map(s => s.id === id ? { ...student, id } : s);
    setStudents(updatedStudents);
    localStorage.setItem('avs_students', JSON.stringify(updatedStudents));
  };

  const markAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords = records.map(record => ({
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    const updatedAttendance = [...attendanceRecords, ...newRecords];
    setAttendanceRecords(updatedAttendance);
    localStorage.setItem('avs_attendance', JSON.stringify(updatedAttendance));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-blue-900 text-lg sm:text-xl lg:text-2xl truncate">AVS ENGINEERING COLLEGE</div>
              <div className="text-blue-600 text-sm sm:text-base">DEPARTMENT OF CSE</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-gray-600 text-sm">Welcome, {currentUser}</span>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Session Active</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 h-8 sm:h-10 px-2 sm:px-4"
                size="sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Session Warning */}
      {sessionWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert className="border-orange-200 bg-orange-50 shadow-lg">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex flex-col gap-2">
                <div>Your session will expire in {Math.ceil(timeRemaining / 1000)} seconds</div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={continueSession}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Continue Session
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-orange-200 text-orange-700"
                  >
                    Logout Now
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          {/* Mobile-optimized tabs */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-1 sticky top-16 sm:top-20 z-40">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-transparent gap-1 h-auto p-0">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 h-12 sm:h-10 text-xs sm:text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="students" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 h-12 sm:h-10 text-xs sm:text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Students</span>
              </TabsTrigger>
              <TabsTrigger 
                value="attendance" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 h-12 sm:h-10 text-xs sm:text-sm"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Attendance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-col sm:flex-row gap-1 sm:gap-2 h-12 sm:h-10 text-xs sm:text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <Dashboard students={students} attendanceRecords={attendanceRecords} />
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement 
              students={students} 
              onAddStudent={addStudent}
              onUpdateStudent={updateStudent}
            />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceMarking 
              students={students}
              onMarkAttendance={markAttendance}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="reports">
            <Reports 
              students={students}
              attendanceRecords={attendanceRecords}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

export default App;