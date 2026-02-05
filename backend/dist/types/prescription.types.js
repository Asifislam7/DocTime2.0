"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStatus = exports.DocumentType = void 0;
var DocumentType;
(function (DocumentType) {
    DocumentType["PRESCRIPTION"] = "prescription";
    DocumentType["LAB_REPORT"] = "lab_report";
    DocumentType["X_RAY"] = "x_ray";
    DocumentType["MRI"] = "mri";
    DocumentType["CT_SCAN"] = "ct_scan";
    DocumentType["ULTRASOUND"] = "ultrasound";
    DocumentType["MEDICAL_CERTIFICATE"] = "medical_certificate";
    DocumentType["DISCHARGE_SUMMARY"] = "discharge_summary";
    DocumentType["OTHER"] = "other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "pending";
    DocumentStatus["PROCESSED"] = "processed";
    DocumentStatus["FAILED"] = "failed";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
//# sourceMappingURL=prescription.types.js.map