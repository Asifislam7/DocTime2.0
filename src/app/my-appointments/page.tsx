"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Download, AlertCircle, FileText, X, Edit, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import { API_BASE } from "@/lib/api";

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
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

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<RescheduleData>({
    appointmentId: "",
    newDate: "",
    newTime: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  ];

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      const response = await fetch(
        `${API_BASE}/api/v1/appointments/email/${encodeURIComponent(email!)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      fetchAppointments();
    }
  }, [isLoaded, user?.primaryEmailAddress?.emailAddress, fetchAppointments]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#A5AF79]/15 text-[#A5AF79] border-[#A5AF79]/30";
      case "pending":
        return "bg-[#E8723C]/15 text-[#E8723C] border-[#E8723C]/30";
      case "cancelled":
        return "bg-white/5 text-white/50 border-white/10";
      case "completed":
        return "bg-[#F5E6D3]/10 text-[#F5E6D3] border-[#F5E6D3]/25";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const openRescheduleModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      appointmentId: appointment._id,
      newDate: appointment.appointmentDate,
      newTime: appointment.appointmentTime,
    });
    setShowRescheduleModal(true);
  };

  const openCancelModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleReschedule = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      alert("Please select both date and time");
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE}/api/v1/appointments/${rescheduleData.appointmentId}/reschedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentDate: rescheduleData.newDate,
            appointmentTime: rescheduleData.newTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule appointment");
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === rescheduleData.appointmentId
            ? {
                ...apt,
                appointmentDate: rescheduleData.newDate,
                appointmentTime: rescheduleData.newTime,
              }
            : apt
        )
      );

      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setRescheduleData({ appointmentId: "", newDate: "", newTime: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reschedule appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE}/api/v1/appointments/${selectedAppointment._id}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === selectedAppointment._id
            ? { ...apt, status: "cancelled" as const }
            : apt
        )
      );

      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const generateAppointmentSlip = (appointment: Appointment) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(232, 114, 60);
    doc.text("DocTime", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(10, 10, 10);
    doc.text("Appointment Slip", 105, 35, { align: "center" });

    doc.setDrawColor(232, 114, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(12);
    doc.setTextColor(10, 10, 10);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Details", 20, 55);
    doc.setFont("helvetica", "normal");

    let yPos = 70;

    doc.text(`Patient Name: ${appointment.patientName}`, 20, yPos);
    yPos += 8;
    doc.text(`Doctor: ${appointment.doctorName}`, 20, yPos);
    yPos += 8;
    doc.text(
      `Date: ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
      20,
      yPos
    );
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

    doc.text(
      `Booked on: ${new Date(appointment.createdAt).toLocaleDateString()}`,
      20,
      yPos
    );

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 270);
    doc.text("DocTime - Your Health, Our Priority", 105, 270, { align: "center" });

    const fileName = `appointment_slip_${appointment.patientName.replace(/\s+/g, "_")}_${new Date(appointment.appointmentDate).toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center tracking-wide">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8723C] mx-auto" />
          <p className="mt-4 text-white/65">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center tracking-wide">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-[#E8723C] mx-auto mb-4" />
          <h1 className="text-2xl font-medium text-white mb-2 tracking-wide">
            Access Denied
          </h1>
          <p className="text-white/65 mb-6">
            You need to be signed in to view your appointments.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#F5E6D3] hover:bg-white text-[#0A0A0A] rounded-full px-6"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: Calendar,
    },
    {
      label: "Confirmed",
      value: appointments.filter((a) => a.status === "confirmed").length,
      icon: FileText,
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      icon: Clock,
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-12 tracking-wide">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50 mb-3">
            Your care
          </p>
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-3 tracking-wide">
            My Appointments
          </h1>
          <p className="text-base text-white/65 max-w-xl mx-auto">
            Welcome back, {user.firstName || user.fullName}. Here are your
            scheduled visits.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#141414] border border-white/[0.08] rounded-xl p-5 text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8723C]/12 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-[#E8723C]" />
                </div>
                <p className="text-2xl font-medium text-white tracking-wide">
                  {stat.value}
                </p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8723C] mx-auto" />
            <p className="mt-4 text-white/65">Loading your appointments...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#E8723C]/10 border border-[#E8723C]/25 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-[#E8723C]" />
              <p className="text-white/90">{error}</p>
            </div>
            <Button
              variant="outline"
              className="border-white/15 text-white hover:bg-white/5 bg-transparent"
              onClick={fetchAppointments}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Appointments list */}
        {!loading && !error && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-[#141414] border border-white/[0.08] rounded-xl text-center py-16 px-6">
                <Calendar className="h-14 w-14 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2 tracking-wide">
                  No appointments found
                </h3>
                <p className="text-white/65 mb-6 max-w-md mx-auto">
                  You haven&apos;t booked any appointments yet. Schedule your
                  first visit to get started.
                </p>
                <Button
                  onClick={() => (window.location.href = "/appointment")}
                  className="bg-[#F5E6D3] hover:bg-white text-[#0A0A0A] rounded-full px-6"
                >
                  Book Your First Appointment
                </Button>
              </div>
            ) : (
              appointments.map((appointment) => (
                <article
                  key={appointment._id}
                  className="bg-[#141414] border border-white/[0.08] rounded-xl p-6 hover:border-white/[0.15] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#E8723C]/15 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#E8723C]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white tracking-wide">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-white/50">Doctor</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium border rounded-full tracking-wide ${getStatusStyle(appointment.status)}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <User className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-[0.1em]">
                          Patient
                        </p>
                        <p className="text-white">{appointment.patientName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-[0.1em]">
                          Date
                        </p>
                        <p className="text-white">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-[0.1em]">
                          Time
                        </p>
                        <p className="text-white">{appointment.appointmentTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white/60" />
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase tracking-[0.1em]">
                          Reason
                        </p>
                        <p className="text-white">{appointment.reason}</p>
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mb-6 p-4 bg-[#1C1C1C] rounded-lg border border-white/[0.08]">
                      <p className="text-sm text-white/70">
                        <span className="text-white font-medium">Notes:</span>{" "}
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/[0.08]">
                    <div className="text-sm text-white/45">
                      Booked on{" "}
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(appointment.status === "pending" ||
                        appointment.status === "confirmed") && (
                        <>
                          <Button
                            onClick={() => openRescheduleModal(appointment)}
                            variant="outline"
                            className="border-white/15 text-white hover:bg-white/5 bg-transparent rounded-full"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                          <Button
                            onClick={() => openCancelModal(appointment)}
                            variant="outline"
                            className="border-white/15 text-white/70 hover:text-white hover:bg-white/5 bg-transparent rounded-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}

                      <Button
                        onClick={() => generateAppointmentSlip(appointment)}
                        className="bg-[#E8723C] hover:bg-[#F08A55] text-[#0A0A0A] rounded-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Slip
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6 w-full max-w-md tracking-wide">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white tracking-wide">
                Reschedule Appointment
              </h3>
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="text-white/50 hover:text-white transition-colors bg-transparent border-0 p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="newDate"
                  className="text-sm font-medium text-white/70"
                >
                  New Date
                </Label>
                <Input
                  id="newDate"
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) =>
                    setRescheduleData((prev) => ({
                      ...prev,
                      newDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 bg-[#1C1C1C] border-white/10 text-white"
                />
              </div>

              <div>
                <Label
                  htmlFor="newTime"
                  className="text-sm font-medium text-white/70"
                >
                  New Time
                </Label>
                <Select
                  value={rescheduleData.newTime}
                  onValueChange={(value) =>
                    setRescheduleData((prev) => ({ ...prev, newTime: value }))
                  }
                >
                  <SelectTrigger className="mt-1 bg-[#1C1C1C] border-white/10 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-white/10 text-white">
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
                  className="flex-1 border-white/15 text-white hover:bg-white/5 bg-transparent rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={
                    actionLoading ||
                    !rescheduleData.newDate ||
                    !rescheduleData.newTime
                  }
                  className="flex-1 bg-[#E8723C] hover:bg-[#F08A55] text-[#0A0A0A] rounded-full"
                >
                  {actionLoading ? "Rescheduling..." : "Reschedule"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6 w-full max-w-md tracking-wide">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white tracking-wide">
                Cancel Appointment
              </h3>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="text-white/50 hover:text-white transition-colors bg-transparent border-0 p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#E8723C]/10 border border-[#E8723C]/25 rounded-lg">
                <p className="text-sm text-white/80">
                  Are you sure you want to cancel your appointment with{" "}
                  <strong className="text-white">
                    {selectedAppointment.doctorName}
                  </strong>{" "}
                  on{" "}
                  {new Date(
                    selectedAppointment.appointmentDate
                  ).toLocaleDateString()}{" "}
                  at {selectedAppointment.appointmentTime}?
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCancelModal(false)}
                  variant="outline"
                  className="flex-1 border-white/15 text-white hover:bg-white/5 bg-transparent rounded-full"
                >
                  Keep Appointment
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="flex-1 bg-[#E8723C] hover:bg-[#F08A55] text-[#0A0A0A] rounded-full"
                >
                  {actionLoading ? "Cancelling..." : "Cancel Appointment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
