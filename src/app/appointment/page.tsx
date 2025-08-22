"use client";
import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Listbox } from "@headlessui/react";

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

export default function AppointmentPage() {
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      // Personal Information
      name: "",
      email: "",
      phoneNumber: "",
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

  const [success, setSuccess] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(Doctors[0]);

  const onSubmit = async (data: unknown) => {
    try {
      // TODO: Send data to backend
      console.log("Form data:", data);
      
      // Here you would typically:
      // 1. Create user profile in backend
      // 2. Create appointment record
      // 3. Send confirmation email
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 2000);
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172B] py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
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
              className="relative overflow-hidden px-12 py-4 rounded-lg bg-gradient-to-r from-[#06A3DA] to-[#0F172B] text-white font-bold text-xl shadow-lg transition-all duration-200 animate-glow group hover:scale-105 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmitting ? "Submitting..." : "Submit Appointment"}
              </span>
              {/* Shine animation */}
              <span className="absolute left-0 top-0 h-full w-full pointer-events-none">
                <span className="block h-full w-1/3 bg-white/30 blur-lg opacity-0 group-hover:opacity-100 animate-shine"></span>
              </span>
            </button>

            {success && (
              <div className="mt-6 text-[#06A3DA] text-center font-semibold text-lg animate-fade-in">
                Appointment submitted successfully!
              </div>
            )}
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 16px #06A3DA44; }
          50% { box-shadow: 0 0 32px #06A3DA99; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }
        .animate-fade-in { animation: fade-in 1s ease; }
        .animate-slide-down { animation: slide-down 1s cubic-bezier(.4,0,.2,1); }
        .animate-glow { animation: glow 2s infinite alternate; }
        .animate-shine { animation: shine 3s forwards infinite; }
        body, input, textarea, select, button { font-family: var(--font-roboto), sans-serif !important; }
      `}</style>
    </div>
  );
}