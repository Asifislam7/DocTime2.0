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
];

export default function AppointmentPage() {
  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
    },
  });

  const [success, setSuccess] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(Doctors[0]);

  const onSubmit = async (data: any) => {
    // TODO: Send data to backend
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      reset();
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172B] py-12 px-2">
      <div className="w-full max-w-2xl p-10 rounded-2xl shadow-2xl bg-white border border-blue-100 animate-fade-in font-sans">
        <h2 className="text-4xl font-extrabold text-[#0F172B] mb-2 text-center tracking-tight animate-slide-down font-sans">
          Book an Appointment
        </h2>
        <p className="text-[#6c757d] text-center mb-8 animate-fade-in delay-100 font-sans">
          Fill in your details and we’ll get you scheduled.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
          {/* Doctor select */}
          <div>
            <label className="block mb-2 font-semibold text-[#0F172B]">Doctor</label>
            <Controller
              control={control}
              name="primaryPhysician"
              render={({ field }) => (
                <Listbox value={field.value} onChange={value => { field.onChange(value); setSelectedDoctor(Doctors.find(d => d.name === value)); }}>
                  <div className="relative">
                    <Listbox.Button className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 flex items-center gap-2">
                      {selectedDoctor && (
                        <>
                          <Image src={selectedDoctor.image} alt={selectedDoctor.name} width={32} height={32} className="rounded-full border" />
                          <span>{selectedDoctor.name}</span>
                        </>
                      )}
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-blue-100">
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
          {/* Date picker */}
          <div>
            <label className="block mb-2 font-semibold text-[#0F172B]">Expected appointment date</label>
            <Controller
              control={control}
              name="schedule"
              render={({ field }) => (
                <DatePicker
                  className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200"
                  selected={field.value}
                  onChange={field.onChange}
                  showTimeSelect
                  dateFormat="MM/dd/yyyy  -  h:mm aa"
                  minDate={new Date()}
                  required
                />
              )}
            />
          </div>
          {/* Reason */}
          <div>
            <label className="block mb-2 font-semibold text-[#0F172B]">Appointment reason</label>
            <textarea
              {...register("reason", { required: true })}
              placeholder="Annual monthly check-up"
              className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
              rows={2}
              required
            />
          </div>
          {/* Notes */}
          <div>
            <label className="block mb-2 font-semibold text-[#0F172B]">Comments/notes</label>
            <textarea
              {...register("note")}
              placeholder="Prefer afternoon appointments, if possible"
              className="w-full px-4 py-3 rounded-lg bg-[#F4F6F8] text-[#0F172B] border border-blue-100 focus:border-[#06A3DA] focus:ring-2 focus:ring-[#06A3DA] outline-none transition-all duration-200 resize-none"
              rows={2}
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative overflow-hidden w-full py-3 rounded-lg bg-gradient-to-r from-[#06A3DA] to-[#0F172B] text-white font-bold text-lg shadow-lg transition-all duration-200 animate-glow group hover:scale-105 focus:outline-none"
          >
            <span className="relative z-10">{isSubmitting ? "Submitting..." : "Submit Appointment"}</span>
            {/* Shine animation */}
            <span className="absolute left-0 top-0 h-full w-full pointer-events-none">
              <span className="block h-full w-1/3 bg-white/30 blur-lg opacity-0 group-hover:opacity-100 animate-shine"></span>
            </span>
          </button>
          {success && (
            <div className="text-[#06A3DA] text-center font-semibold animate-fade-in">
              Appointment submitted successfully!
            </div>
          )}
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