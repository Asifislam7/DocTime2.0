"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PatientDetailsPage() {
//   const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // const formData = new FormData(e.currentTarget)

    // try {
    //   // Here you would integrate with Supabase to update the user profile
    //   // const { data: { user } } = await supabase.auth.getUser()
    //   //
    //   // if (!user) throw new Error("User not authenticated")
    //   //
    //   // const { error } = await supabase
    //   //   .from('patient_profiles')
    //   //   .insert({
    //   //     user_id: user.id,
    //   //     dob: formData.get('dob'),
    //   //     gender: formData.get('gender'),
    //   //     address: formData.get('address'),
    //   //     phone: formData.get('phone'),
    //   //     emergency_contact: formData.get('emergency-contact'),
    //   //     aadhar_number: formData.get('aadhar'),
    //   //     pan_number: formData.get('pan'),
    //   //     mother_name: formData.get('mother-name'),
    //   //     medical_history: formData.get('medical-history'),
    //   //     insurance_details: formData.get('insurance')
    //   //   })
    //   //
    //   // if (error) throw error

    //   // Simulate successful profile update
    //   setTimeout(() => {
    //     setIsLoading(false)
    //     router.push("/appointments/schedule")
    //   }, 1000)
    // } catch (err: any) {
    //   setIsLoading(false)
    //   setError(err.message || "Failed to update profile")
    // }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="patient"
            className=" h-10 w-fit"
          />
            <span className="text-xl font-bold">DocTime</span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Please provide your detailed information for better healthcare service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" placeholder="Enter your full address" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+91 9876543210" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-contact">Emergency Contact</Label>
                <Input
                  id="emergency-contact"
                  name="emergency-contact"
                  type="tel"
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input id="aadhar" name="aadhar" placeholder="XXXX XXXX XXXX" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input id="pan" name="pan" placeholder="ABCDE1234F" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mother-name">Mother Name</Label>
              <Input id="mother-name" name="mother-name" placeholder="Enter mother's name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-history">Medical History</Label>
              <Textarea
                id="medical-history"
                name="medical-history"
                placeholder="Any pre-existing conditions, allergies, or ongoing treatments"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance Details (if any)</Label>
              <Input id="insurance" name="insurance" placeholder="Insurance provider and policy number" />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="consent" name="consent" required className="h-4 w-4" />
                <Label htmlFor="consent" className="text-sm text-red-400">
                    I consent to the collection and use of my personal information for medical purposes.
                </Label>
            </div>
          <div className="text-center text-sm text-muted-foreground">
            Your information is secure and will only be used for medical purposes
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
