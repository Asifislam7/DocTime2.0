"use client";
import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Listbox } from "@headlessui/react";
import { useToast } from "@/components/ui/toast";
import jsPDF from "jspdf";
import { useUser, SignIn } from "@clerk/nextjs";

// Dummy doctors list for demo
const Doctors = [
  { name: "Dr. Alice Smith", image: "/assets/images/dr-green.png" },
  { name: "Dr. Bob Johnson", image: "/assets/images/dr-cruz.png" },
  { name: "Dr. Carol Lee", image: "/assets/images/dr-lee.png" },
  { name: "Dr. David Wilson", image: "/assets/images/dr-lee.png" },
  { name: "Dr. Emma Davis", image: "/assets/images/dr-cruz.png" },
];

const GenderOptions = ["male", "female", "other", "prefer_not_to_say"];
const IdentificationTypes = ["Passport", "Driver's License", "National ID", "Social Security Card", "Other"];

// Form data type
type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string;
  currentMedications?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  primaryPhysician: string;
  schedule: Date;
  reason: string;
  note?: string;
  identificationType?: string;
  identificationNumber?: string;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  privacyConsent: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
};

export default function AppointmentPage() {
  const { user, isLoaded } = useUser();
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      // Personal Information
      name: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phoneNumber: user?.primaryPhoneNumber?.phoneNumber || "",
      dateOfBirth: new Date(),
      gender: "",
      address: "",
      
      // Emergency Contact
      emergencyContactName: "",
      emergencyContactNumber: "",
      
      // Insurance
      insuranceProvider: "",
      insurancePolicyNumber: "",
      
      // Medical Information
      allergies: "",
      currentMedications: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      
      // Appointment Details
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      
      // Identification
      identificationType: "",
      identificationNumber: "",
      
      // Consent
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
      
      // Notification Preferences
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  const [selectedDoctor, setSelectedDoctor] = useState(Doctors[0]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [appointmentData, setAppointmentData] = useState<FormData | null>(null);
  const { addToast } = useToast();

  // Function to generate and download PDF receipt
  const generateReceipt = (data: FormData) => {
    const doc = new jsPDF();
    
    // Add logo/header
    doc.setFontSize(24);
    doc.setTextColor(6, 163, 218); // #06A3DA
    doc.text("DocTime", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 43); // #0F172B
    doc.text("Appointment Receipt", 105, 35, { align: "center" });
    
    // Add line separator
    doc.setDrawColor(6, 163, 218);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Patient Information Section
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 43);
    doc.setFont("", "bold");
    doc.text("Patient Information", 20, 55);
    doc.setFont("", "normal");
    
    doc.setFontSize(10);
    doc.text(`Name: ${String(data.name || 'N/A')}`, 20, 65);
    doc.text(`Email: ${String(data.email || 'N/A')}`, 20, 72);
    doc.text(`Phone: ${String(data.phoneNumber || 'N/A')}`, 20, 79);
    doc.text(`Date of Birth: ${String(data.dateOfBirth?.toLocaleDateString() || 'N/A')}`, 20, 86);
    doc.text(`Gender: ${String(data.gender || 'N/A')}`, 20, 93);
    if (data.address) {
      doc.text(`Address: ${String(data.address)}`, 20, 100);
    }
    
    // Doctor Information Section
    doc.setFontSize(14);
    doc.setFont("", "bold");
    doc.text("Doctor Information", 20, 115);
    doc.setFont("", "normal");
    
    doc.setFontSize(10);
    doc.text(`Doctor: ${String(data.primaryPhysician || 'N/A')}`, 20, 125);
    
    // Appointment Details Section
    doc.setFontSize(14);
    doc.setFont("", "bold");
    doc.text("Appointment Details", 20, 140);
    doc.setFont("", "normal");
    
    doc.setFontSize(10);
    doc.text(`Date & Time: ${String(data.schedule?.toLocaleString() || 'N/A')}`, 20, 150);
    doc.text(`Reason: ${String(data.reason || 'N/A')}`, 20, 157);
    if (data.note) {
      doc.text(`Notes: ${String(data.note)}`, 20, 164);
    }
    
    // Medical Information Section
    if (data.allergies || data.currentMedications || data.pastMedicalHistory) {
      doc.setFontSize(14);
      doc.setFont("", "bold");
      doc.text("Medical Information", 20, 179);
      doc.setFont("", "normal");
      
      doc.setFontSize(10);
      let yPos = 189;
      if (data.allergies) {
        doc.text(`Allergies: ${String(data.allergies)}`, 20, yPos);
        yPos += 7;
      }
      if (data.currentMedications) {
        doc.text(`Current Medications: ${String(data.currentMedications)}`, 20, yPos);
        yPos += 7;
      }
      if (data.pastMedicalHistory) {
        doc.text(`Past Medical History: ${String(data.pastMedicalHistory)}`, 20, yPos);
        yPos += 7;
      }
    }
    
    // Insurance Information Section
    if (data.insuranceProvider || data.insurancePolicyNumber) {
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Insurance Information", 20, 220);
      doc.setFont(undefined, "normal");
      
      doc.setFontSize(10);
      if (data.insuranceProvider) {
        doc.text(`Provider: ${String(data.insuranceProvider)}`, 20, 230);
      }
      if (data.insurancePolicyNumber) {
        doc.text(`Policy Number: ${String(data.insurancePolicyNumber)}`, 20, 237);
      }
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 270);
    doc.text("DocTime - Your Health, Our Priority", 105, 270, { align: "center" });
    
    // Save the PDF
    const fileName = `appointment_receipt_${(data.name || 'patient').replace(/\s+/g, '_')}_${data.schedule?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      console.log("Starting form submission...");
      
      // Show loading toast
      addToast({
        type: 'info',
        title: 'Submitting Appointment',
        message: 'Please wait while we process your request...',
        duration: 3000, // Show for 3 seconds
      });
      
      // Prepare appointment data for backend
      const appointmentData = {
        clerkUserId: user?.id || `temp_${Date.now()}`,
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        
        // Medical Information
        allergies: data.allergies || "",
        currentMedications: data.currentMedications || "",
        familyMedicalHistory: data.familyMedicalHistory,
        pastMedicalHistory: data.pastMedicalHistory,
        
        // Insurance & Emergency
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactNumber: data.emergencyContactNumber,
        
        // Appointment Details
        primaryPhysician: data.primaryPhysician,
        schedule: data.schedule,
        reason: data.reason,
        note: data.note,
        
        // Consent & Preferences
        treatmentConsent: data.treatmentConsent,
        disclosureConsent: data.disclosureConsent,
        privacyConsent: data.privacyConsent,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
        pushNotifications: data.pushNotifications,
        
        // Identification
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber
      };

      console.log("Sending appointment data to backend:", appointmentData);

      // Send to appointment API instead of user API
      const response = await fetch('http://localhost:3001/api/v1/appointments/from-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      
      // Store appointment data and show receipt BEFORE showing success toast
      console.log("Setting appointment data and showing receipt...");
      setAppointmentData(data);
      setShowReceipt(true);
      
      console.log("Receipt state set:", { showReceipt: true, appointmentData: data });
      
      // Show success toast with appointment details
      addToast({
        type: 'success',
        title: 'Appointment Request Sent! 🎉',
        message: `Your appointment request has been submitted successfully. We'll contact you at ${data.email} to confirm your ${data.schedule.toLocaleDateString()} appointment with ${data.primaryPhysician}.`,
        duration: 8000, // Show for 8 seconds
        action: {
          label: 'View Details',
          onClick: () => {
            // TODO: Show appointment details modal or navigate to confirmation page
            console.log('Show appointment details');
          }
        }
      });
      
      // Don't reset form immediately - let user see the receipt first
      // reset();
      
    } catch (error) {
      console.error("Error submitting appointment:", error);
      
      // Show error toast
      addToast({
        type: 'error',
        title: 'Appointment Submission Failed',
        message: error instanceof Error ? error.message : 'Failed to submit appointment. Please try again.',
        duration: 10000, // Show for 10 seconds
        action: {
          label: 'Try Again',
          onClick: () => {
            // TODO: Retry submission or show error details
            console.log('Retry submission');
          }
        }
      });
    }
  };

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#0F172B] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#0F172B] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-[#0F172B] mb-4 text-center">Sign In Required</h2>
          <p className="text-[#6B7280] mb-6 text-center">
            Please sign in to book an appointment.
          </p>
          <SignIn />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0F172B] py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Receipt Download Section - Shows after successful submission */}
        {showReceipt && appointmentData && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-2xl p-6 mb-8 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800">Appointment Confirmed!</h3>
                  <p className="text-green-600">Your appointment has been scheduled successfully.</p>
                </div>
              </div>
              <button
                onClick={() => generateReceipt(appointmentData)}
                className="px-6 py-3 bg-gradient-to-r from-[#06A3DA] to-[#0F172B] text-white font-semibold rounded-lg hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Book an Appointment
          </h2>
          <p className="text-[#B0B8C1] text-xl max-w-2xl mx-auto">
            Fill in your details and we&apos;ll get you scheduled with our healthcare professionals.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Full Name *</label>
                <input
                  {...register("name", { required: true })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Email Address *</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="johndoe@gmail.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Phone Number *</label>
                <input
                  {...register("phoneNumber", { required: true })}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Date of Birth *</label>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <DatePicker
                      className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MM/dd/yyyy"
                      maxDate={new Date()}
                      required
                    />
                  )}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Gender *</label>
                <select
                  {...register("gender", { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select gender</option>
                  {GenderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "male" ? "Male" : 
                       option === "female" ? "Female" : 
                       option === "other" ? "Other" : 
                       "Prefer not to say"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Address</label>
                <input
                  {...register("address")}
                  placeholder="123 Main St, City, State 12345"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Emergency Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency Contact Name */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Emergency Contact Name</label>
                <input
                  {...register("emergencyContactName")}
                  placeholder="Guardian's name"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>

              {/* Emergency Contact Number */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Emergency Contact Number</label>
                <input
                  {...register("emergencyContactNumber")}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Insurance Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Insurance Provider */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Insurance Provider</label>
                <input
                  {...register("insuranceProvider")}
                  placeholder="BlueCross BlueShield"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>

              {/* Insurance Policy Number */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Insurance Policy Number</label>
                <input
                  {...register("insurancePolicyNumber")}
                  placeholder="ABC123456789"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Medical Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Physician */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Primary Care Physician *</label>
                <Controller
                  control={control}
                  name="primaryPhysician"
                  render={({ field }) => (
                    <Listbox value={field.value} onChange={value => { field.onChange(value); setSelectedDoctor(Doctors.find(d => d.name === value) || Doctors[0]); }}>
                      <div className="relative">
                        <Listbox.Button className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 flex items-center gap-2">
                          {selectedDoctor && (
                            <>
                              <Image src={selectedDoctor.image} alt={selectedDoctor.name} width={32} height={32} className="rounded-full border" />
                              <span>{selectedDoctor.name}</span>
                            </>
                          )}
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-blue-100 max-h-60 overflow-auto">
                          {Doctors.map((doctor, i) => (
                            <Listbox.Option
                              key={doctor.name + i}
                              value={doctor.name}
                              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#06A3DA]/10"
                            >
                              <Image src={doctor.image} alt={doctor.name} width={32} height={32} className="rounded-full border" />
                              <span>{doctor.name}</span>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  )}
                  rules={{ required: true }}
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Expected Appointment Date *</label>
                <Controller
                  control={control}
                  name="schedule"
                  render={({ field }) => (
                    <DatePicker
                      className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      dateFormat="MM/dd/yyyy - h:mm aa"
                      minDate={new Date()}
                      required
                    />
                  )}
                />
              </div>
            </div>

            {/* Full-width fields */}
            <div className="mt-6 space-y-6">
              {/* Reason */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Appointment Reason *</label>
                <textarea
                  {...register("reason", { required: true })}
                  placeholder="Annual monthly check-up"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Allergies (if any)</label>
                <textarea
                  {...register("allergies")}
                  placeholder="Peanuts, Penicillin, Pollen"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Current Medication */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Current Medications</label>
                <textarea
                  {...register("currentMedications")}
                  placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Family Medical History */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Family Medical History (if relevant)</label>
                <textarea
                  {...register("familyMedicalHistory")}
                  placeholder="Mother had brain cancer, Father has hypertension"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Past Medical History */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Past Medical History</label>
                <textarea
                  {...register("pastMedicalHistory")}
                  placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Additional Comments/Notes</label>
                <textarea
                  {...register("note")}
                  placeholder="Prefer afternoon appointments, if possible. Any other relevant information..."
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Notification Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <input
                  {...register("emailNotifications")}
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="emailNotifications" className="text-[#0F172B] text-sm leading-relaxed">
                  Email Notifications
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  {...register("smsNotifications")}
                  type="checkbox"
                  id="smsNotifications"
                  className="h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="smsNotifications" className="text-[#0F172B] text-sm leading-relaxed">
                  SMS Notifications
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  {...register("pushNotifications")}
                  type="checkbox"
                  id="pushNotifications"
                  className="h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="pushNotifications" className="text-[#0F172B] text-sm leading-relaxed">
                  Push Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Identification Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Identification and Verification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identification Type */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Identification Type</label>
                <select
                  {...register("identificationType")}
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                >
                  <option value="">Select identification type</option>
                  {IdentificationTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Identification Number */}
              <div>
                <label className="block mb-2 font-semibold text-[#0F172B]">Identification Number</label>
                <input
                  {...register("identificationNumber")}
                  placeholder="123456789"
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Consent Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-[#0F172B] mb-6 border-b border-gray-200 pb-3">
              Consent and Privacy
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  {...register("treatmentConsent")}
                  type="checkbox"
                  id="treatmentConsent"
                  className="mt-1 h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="treatmentConsent" className="text-[#0F172B] text-sm leading-relaxed">
                  I consent to receive treatment for my health condition.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  {...register("disclosureConsent")}
                  type="checkbox"
                  id="disclosureConsent"
                  className="mt-1 h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="disclosureConsent" className="text-[#0F172B] text-sm leading-relaxed">
                  I consent to the use and disclosure of my health information for treatment purposes.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  {...register("privacyConsent")}
                  type="checkbox"
                  id="privacyConsent"
                  className="mt-1 h-4 w-4 text-[#06A3DA] border-gray-300 rounded focus:ring-[#06A3DA] focus:ring-2"
                />
                <label htmlFor="privacyConsent" className="text-[#0F172B] text-sm leading-relaxed">
                  I acknowledge that I have reviewed and agree to the privacy policy.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden px-12 py-4 rounded-lg bg-gradient-to-r from-[#06A3DA] to-[#0F172B] text-white font-bold text-xl shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmitting ? "Submitting..." : "Submit Appointment"}
              </span>
              {/* Shine animation */}
              <span className="absolute left-0 top-0 h-full w-full pointer-events-none">
                <span className="block h-full w-1/3 bg-white/30 blur-lg opacity-0 group-hover:opacity-100 animate-shine"></span>
              </span>
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }
        .animate-shine { animation: shine 3s forwards infinite; }
      `}</style>
    </div>
  );
}