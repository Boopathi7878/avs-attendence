import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { GraduationCap, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

interface Credential {
  username: string;
  password: string;
  name: string;
  role: 'Admin' | 'Faculty' | 'HoD';
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock credentials
  const staffCredentials: Credential[] = [
    { username: 'vallarasu', password: 'vallu123', name: 'Vallarasu P', role: 'Admin' },
    { username: 'priyasettu', password: 'avs2025', name: 'Priyadarshini S', role: 'Faculty' },
    { username: 'vijaykumar', password: 'cse123', name: 'Dr.Vijay Kumar', role: 'HoD' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const staff = staffCredentials.find(
      (s) => s.username === username && s.password === password
    );

    if (staff) {
      onLogin(staff.name);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* College Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-white rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
          </div>
          <div className="text-white text-xl sm:text-2xl lg:text-3xl mb-2 px-2">AVS ENGINEERING COLLEGE</div>
          <div className="text-blue-200 text-base sm:text-lg">DEPARTMENT OF CSE</div>
          <div className="text-blue-300 text-sm mt-2">Attendance Management System</div>
        </div>

        {/* Login Card */}
        <Card className="bg-white shadow-2xl border-0 mx-2 sm:mx-0">
          <CardHeader className="space-y-2 text-center pb-4 sm:pb-6 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl text-gray-800">Staff Login</CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">
              Access the attendance management system
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base mt-6"
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 mb-2">Demo Credentials:</div>
              <div className="space-y-1 text-xs text-blue-700">
                {staffCredentials.map((staff, index) => (
                  <div key={index}>
                    <strong>{staff.role}:</strong> {staff.username} / {staff.password}
                  </div>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="mt-4 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-800 mb-1">Security Features:</div>
              <div className="space-y-1 text-xs text-amber-700">
                <div>• Auto-logout after 30 minutes of inactivity</div>
                <div>• Warning notification 5 minutes before logout</div>
                <div>• Photo upload support for student profiles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-blue-200 text-xs sm:text-sm px-4">
          © 2024 AVS Engineering College. All rights reserved.
        </div>
      </div>
    </div>
  );
}
