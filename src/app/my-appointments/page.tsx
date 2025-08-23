"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Download, AlertCircle, FileText, X, Edit, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

interface RescheduleData {
  appointmentId: string;
  newDate: string;
  newTime: string;
}

export default function MyAppointmentsPage() {
  const { user, isLoaded } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<RescheduleData>({
    appointmentId: '',
    newDate: '',
    newTime: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      fetchAppointments();
    }
  }, [isLoaded, user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      const response = await fetch(`http://localhost:3001/api/v1/appointments/email/${encodeURIComponent(email!)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      appointmentId: appointment._id,
      newDate: appointment.appointmentDate,
      newTime: appointment.appointmentTime
    });
    setShowRescheduleModal(true);
  };

  // Open cancel modal
  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  // Handle reschedule appointment
  const handleReschedule = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:3001/api/v1/appointments/${rescheduleData.appointmentId}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentDate: rescheduleData.newDate,
          appointmentTime: rescheduleData.newTime
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === rescheduleData.appointmentId 
          ? { ...apt, appointmentDate: rescheduleData.newDate, appointmentTime: rescheduleData.newTime }
          : apt
      ));

      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setRescheduleData({ appointmentId: '', newDate: '', newTime: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reschedule appointment');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle cancel appointment
  const handleCancel = async () => {
    if (!selectedAppointment) return;

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:3001/api/v1/appointments/${selectedAppointment._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === selectedAppointment._id 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      ));

      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const generateAppointmentSlip = (appointment: Appointment) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(6, 163, 218); // #06A3DA
    doc.text("DocTime", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 43); // #0F172B
    doc.text("Appointment Slip", 105, 35, { align: "center" });
    
    // Add line separator
    doc.setDrawColor(6, 163, 218);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Appointment Details
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 43);
    doc.setFont("", "bold");
    doc.text("Appointment Details", 20, 55);
    doc.setFont("", "normal");
    
    const yStart = 70;
    let yPos = yStart;
    
    doc.text(`Patient Name: ${appointment.patientName}`, 20, yPos);
    yPos += 8;
    
    doc.text(`Doctor: ${appointment.doctorName}`, 20, yPos);
    yPos += 8;
    
    doc.text(`Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}`, 20, yPos);
    yPos += 8;
    
    doc.text(`Time: ${appointment.appointmentTime}`, 20, yPos);
    yPos += 8;
    
    doc.text(`Reason: ${appointment.reason}`, 20, yPos);
    yPos += 8;
    
    doc.text(`Status: ${getStatusText(appointment.status)}`, 20, yPos);
    yPos += 8;
    
    if (appointment.notes) {
      doc.text(`Notes: ${appointment.notes}`, 20, yPos);
      yPos += 8;
    }
    
    doc.text(`Booked on: ${new Date(appointment.createdAt).toLocaleDateString()}`, 20, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 270);
    doc.text("DocTime - Your Health, Our Priority", 105, 270, { align: "center" });
    
    // Save the PDF
    const fileName = `appointment_slip_${appointment.patientName.replace(/\s+/g, '_')}_${new Date(appointment.appointmentDate).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06A3DA] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need to be signed in to view your appointments.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            My Appointments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Welcome back, {user.firstName || user.fullName}! Here are your scheduled appointments and healthcare visits.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06A3DA] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-3 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={fetchAppointments}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Appointments List */}
        {!loading && !error && (
          <div className="space-y-6">
            {appointments.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-center py-12 transition-all duration-300">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You haven&apos;t booked any appointments yet. Start your healthcare journey by scheduling your first appointment.
                </p>
                <Button 
                  onClick={() => window.location.href = '/appointment'}
                  className="bg-[#06A3DA] hover:bg-[#057bb5] text-white"
                >
                  Book Your First Appointment
                </Button>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#06A3DA] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-[#06A3DA] transition-colors duration-300">
                            {appointment.doctorName}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Doctor
                          </p>
                        </div>
                      </div>
                      <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</p>
                            <p className="text-gray-900 dark:text-white">{appointment.patientName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                            <p className="text-gray-900 dark:text-white">{appointment.appointmentTime}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</p>
                            <p className="text-gray-900 dark:text-white">{appointment.reason}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-3">
                        {/* Action buttons - only show for pending/confirmed appointments */}
                        {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                          <>
                            <Button
                              onClick={() => openRescheduleModal(appointment)}
                              variant="outline"
                              className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button
                              onClick={() => openCancelModal(appointment)}
                              variant="outline"
                              className="border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 hover:scale-105"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        ) : null}
                        
                        <Button
                          onClick={() => generateAppointmentSlip(appointment)}
                          className="bg-[#06A3DA] hover:bg-[#057bb5] text-white transition-all duration-300 hover:scale-105"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Slip
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Reschedule Appointment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="newDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Date
                </Label>
                <Input
                  id="newDate"
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, newDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="newTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Time
                </Label>
                <Select
                  value={rescheduleData.newTime}
                  onValueChange={(value) => setRescheduleData(prev => ({ ...prev, newTime: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowRescheduleModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={actionLoading || !rescheduleData.newDate || !rescheduleData.newTime}
                  className="flex-1 bg-[#06A3DA] hover:bg-[#057bb5] text-white"
                >
                  {actionLoading ? 'Rescheduling...' : 'Reschedule'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cancel Appointment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Are you sure you want to cancel your appointment with <strong>{selectedAppointment.doctorName}</strong> on{' '}
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} at {selectedAppointment.appointmentTime}?
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCancelModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Keep Appointment
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Appointment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
