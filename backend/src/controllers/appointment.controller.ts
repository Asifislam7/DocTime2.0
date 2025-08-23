import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppointmentService } from '../services/appointment.service';
import { User } from '../models/User.model';

export class AppointmentController {
  /**
   * Get appointments by patient email
   */
  static async getAppointmentsByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email parameter is required'
        });
      }

      const appointments = await AppointmentService.getAppointmentsByEmail(email);
      
      res.status(200).json({
        success: true,
        data: appointments,
        message: `Found ${appointments.length} appointment(s)`
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get appointments by patient ID
   */
  static async getAppointmentsByPatientId(req: Request, res: Response) {
    try {
      const { patientId } = req.params;
      
      if (!patientId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID parameter is required'
        });
      }

      const appointments = await AppointmentService.getAppointmentsByPatientId(patientId);
      
      res.status(200).json({
        success: true,
        data: appointments,
        message: `Found ${appointments.length} appointment(s)`
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch appointments',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create a new appointment with comprehensive data
   */
  static async createAppointment(req: Request, res: Response) {
    try {
      const appointmentData = req.body;
      
      // Validate required fields
      const requiredFields = ['patientId', 'patientEmail', 'patientName', 'doctorName', 'appointmentDate', 'reason'];
      for (const field of requiredFields) {
        if (!appointmentData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }

      const appointment = await AppointmentService.createAppointment(appointmentData);
      
      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Appointment created successfully'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create appointment from comprehensive form data
   */
  static async createAppointmentFromForm(req: Request, res: Response) {
    try {
      const formData = req.body;
      
      // Validate required fields
      const requiredFields = ['email', 'name', 'phoneNumber', 'dateOfBirth', 'gender', 'address', 'primaryPhysician', 'schedule', 'reason'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }

      // First, create or update user record
      let user = await User.findOne({ email: formData.email.toLowerCase() });
      
      if (!user) {
        // Create new user
        const userData = {
          clerkUserId: formData.clerkUserId || `temp_${Date.now()}`,
          email: formData.email,
          name: formData.name,
          role: 'patient',
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth),
          gender: formData.gender,
          address: formData.address,
          medicalHistory: formData.pastMedicalHistory ? [formData.pastMedicalHistory] : [],
          allergies: formData.allergies ? [formData.allergies] : [],
          currentMedications: formData.currentMedications ? [formData.currentMedications] : [],
          familyMedicalHistory: formData.familyMedicalHistory,
          pastMedicalHistory: formData.pastMedicalHistory,
          insuranceProvider: formData.insuranceProvider,
          insurancePolicyNumber: formData.insurancePolicyNumber,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactNumber: formData.emergencyContactNumber,
          notificationPreferences: {
            email: formData.emailNotifications,
            sms: formData.smsNotifications,
            push: formData.pushNotifications,
          }
        };
        
        user = new User(userData);
        await user.save();
      } else {
        // Update existing user with new information
        user.phoneNumber = formData.phoneNumber;
        user.dateOfBirth = formData.dateOfBirth instanceof Date ? formData.dateOfBirth : new Date(formData.dateOfBirth);
        user.gender = formData.gender;
        user.address = formData.address;
        user.medicalHistory = formData.pastMedicalHistory ? [formData.pastMedicalHistory] : [];
        user.allergies = formData.allergies ? [formData.allergies] : [];
        user.currentMedications = formData.currentMedications ? [formData.currentMedications] : [];
        user.familyMedicalHistory = formData.familyMedicalHistory;
        user.pastMedicalHistory = formData.pastMedicalHistory;
        user.insuranceProvider = formData.insuranceProvider;
        user.insurancePolicyNumber = formData.insurancePolicyNumber;
        user.emergencyContactName = formData.emergencyContactName;
        user.emergencyContactNumber = formData.emergencyContactNumber;
        user.notificationPreferences = {
          email: formData.emailNotifications,
          sms: formData.smsNotifications,
          push: formData.pushNotifications,
        };
        
        await user.save();
      }

      // Now create the appointment record
      const appointment = await AppointmentService.createAppointmentFromForm(formData, user._id.toString());
      
      // Add appointment reference to user
      user.appointments.push(appointment._id as mongoose.Types.ObjectId);
      await user.save();
      
      res.status(201).json({
        success: true,
        data: {
          user: user,
          appointment: appointment
        },
        message: 'Appointment created successfully'
      });
    } catch (error) {
      console.error('Error creating appointment from form:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(req: Request, res: Response) {
    try {
      const { appointmentId } = req.params;
      const { status } = req.body;
      
      if (!appointmentId || !status) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID and status are required'
        });
      }

      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: pending, confirmed, cancelled, completed'
        });
      }

      const appointment = await AppointmentService.updateAppointmentStatus(appointmentId, status);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: appointment,
        message: 'Appointment status updated successfully'
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete appointment
   */
  static async deleteAppointment(req: Request, res: Response) {
    try {
      const { appointmentId } = req.params;
      
      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID parameter is required'
        });
      }

      const deleted = await AppointmentService.deleteAppointment(appointmentId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
