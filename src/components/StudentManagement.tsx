import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Plus, Search, Edit, Mail, Phone, Calendar, User } from 'lucide-react';
import { PhotoUpload } from './PhotoUpload';
import type { Student } from '../App';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, student: Omit<Student, 'id'>) => void;
}

export function StudentManagement({ students, onAddStudent, onUpdateStudent }: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    department: 'Computer Science Engineering',
    batch: '',
    email: '',
    phone: '',
    photo: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
      setEditingStudent(null);
    } else {
      onAddStudent(formData);
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      studentId: '',
      department: 'Computer Science Engineering',
      batch: '',
      email: '',
      phone: '',
      photo: '',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      studentId: student.studentId,
      department: student.department,
      batch: student.batch,
      email: student.email,
      phone: student.phone,
      photo: student.photo,
      enrollmentDate: student.enrollmentDate
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="text-xl sm:text-2xl text-blue-900">Student Management</div>
          <div className="text-gray-600 text-sm sm:text-base">Manage student profiles and information</div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's information to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 py-4">
                {/* Photo Upload */}
                <PhotoUpload
                  currentPhoto={formData.photo}
                  onPhotoChange={(photoUrl) => setFormData({ ...formData, photo: photoUrl })}
                  studentName={formData.name}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g., AVS2023001"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch/Year</Label>
                  <Input
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g., 2023-2027"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@avs.edu.in"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    className="h-12"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Add Student
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students by name, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-blue-200 focus:border-blue-500 h-12"
        />
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                  <AvatarImage src={student.photo} alt={student.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg text-blue-900 truncate">{student.name}</CardTitle>
                  <CardDescription className="truncate">{student.studentId}</CardDescription>
                  <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200 text-xs">
                    {student.batch}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate text-xs sm:text-sm">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{student.department}</span>
              </div>
              <div className="pt-2">
                <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => !open && setEditingStudent(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(student)}
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-9"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span className="text-xs sm:text-sm">Edit Profile</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-0">
                    <DialogHeader>
                      <DialogTitle>Edit Student Profile</DialogTitle>
                      <DialogDescription>
                        Update the student's information.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-4 py-4">
                        {/* Photo Upload for Edit */}
                        <PhotoUpload
                          currentPhoto={formData.photo}
                          onPhotoChange={(photoUrl) => setFormData({ ...formData, photo: photoUrl })}
                          studentName={formData.name}
                        />
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Full Name</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-studentId">Student ID</Label>
                          <Input
                            id="edit-studentId"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-batch">Batch/Year</Label>
                          <Input
                            id="edit-batch"
                            value={formData.batch}
                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email Address</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-phone">Phone Number</Label>
                          <Input
                            id="edit-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-enrollmentDate">Enrollment Date</Label>
                          <Input
                            id="edit-enrollmentDate"
                            type="date"
                            value={formData.enrollmentDate}
                            onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => setEditingStudent(null)} className="w-full sm:w-auto">
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                          Update Student
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-500">No students found</div>
          {searchTerm && (
            <div className="text-sm text-gray-400 mt-1">
              Try adjusting your search criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
}