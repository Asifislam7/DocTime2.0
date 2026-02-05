import mongoose, { Schema } from 'mongoose';
import { DocumentType, DocumentStatus, IPrescription } from '../types/prescription.types';

// Create the prescription schema
const prescriptionSchema = new Schema({
  // Required fields
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  
  clerkUserId: {
    type: String,
    required: [true, 'Clerk user ID is required'],
    trim: true
  },
  
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: {
      values: Object.values(DocumentType),
      message: 'Invalid document type'
    },
  },
  
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  
  originalFileName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  
  filePath: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size cannot be negative']
  },
  
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    trim: true
  },
  
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: Object.values(DocumentStatus),
      message: 'Invalid status'
    },
    default: DocumentStatus.PENDING,
  },
  
  extractedText: {
    type: String,
    trim: true
  },
  
  metadata: {
    doctorName: {
      type: String,
      trim: true,
      maxlength: [200, 'Doctor name cannot exceed 200 characters']
    },
    dateIssued: {
      type: Date,
      validate: {
        validator: function(v: Date) {
          if (!v) return true;
          const today = new Date();
          return v <= today;
        },
        message: 'Date issued cannot be in the future'
      }
    },
    medicationNames: [{
      type: String,
      trim: true,
      maxlength: [100, 'Medication name cannot exceed 100 characters']
    }],
    dosage: [{
      type: String,
      trim: true,
      maxlength: [100, 'Dosage cannot exceed 100 characters']
    }],
    instructions: [{
      type: String,
      trim: true,
      maxlength: [500, 'Instruction cannot exceed 500 characters']
    }]
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.__v !== undefined) {
        delete ret.__v;
      }
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual fields
prescriptionSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.fileSize;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

prescriptionSchema.virtual('isProcessed').get(function() {
  return this.status === DocumentStatus.PROCESSED;
});

prescriptionSchema.virtual('isPending').get(function() {
  return this.status === DocumentStatus.PENDING;
});

prescriptionSchema.virtual('isFailed').get(function() {
  return this.status === DocumentStatus.FAILED;
});

// Instance methods
prescriptionSchema.methods.updateStatus = async function(status: DocumentStatus) {
  this.status = status;
  await this.save();
};

prescriptionSchema.methods.addExtractedText = async function(text: string) {
  this.extractedText = text;
  this.status = DocumentStatus.PROCESSED;
  await this.save();
};

prescriptionSchema.methods.addMetadata = async function(metadata: any) {
  this.metadata = { ...this.metadata, ...metadata };
  await this.save();
};

// Static methods
prescriptionSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

prescriptionSchema.statics.findByClerkUser = function(clerkUserId: string) {
  return this.find({ clerkUserId }).sort({ createdAt: -1 });
};

prescriptionSchema.statics.findByDocumentType = function(documentType: DocumentType) {
  return this.find({ documentType }).sort({ createdAt: -1 });
};

prescriptionSchema.statics.findByStatus = function(status: DocumentStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Indexes for better query performance
prescriptionSchema.index({ userId: 1 });
prescriptionSchema.index({ clerkUserId: 1 });
prescriptionSchema.index({ documentType: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ title: 'text', description: 'text', extractedText: 'text' });
prescriptionSchema.index({ tags: 1 });
prescriptionSchema.index({ isPublic: 1 });

// Create and export the model
const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);

export { Prescription };
