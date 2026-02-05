"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isDoctor = exports.isPatient = exports.Gender = exports.UserStatus = exports.UserRole = void 0;
// User role enumeration - ensures only valid roles can be assigned
var UserRole;
(function (UserRole) {
    UserRole["PATIENT"] = "patient";
    UserRole["DOCTOR"] = "doctor";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
// User status for account management and business logic
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING_VERIFICATION"] = "pending_verification";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// Gender options for medical records and demographic data
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
    Gender["PREFER_NOT_TO_SAY"] = "prefer_not_to_say";
})(Gender || (exports.Gender = Gender = {}));
// Type guard functions for runtime type checking
const isPatient = (user) => {
    return user.role === UserRole.PATIENT;
};
exports.isPatient = isPatient;
const isDoctor = (user) => {
    return user.role === UserRole.DOCTOR;
};
exports.isDoctor = isDoctor;
const isAdmin = (user) => {
    return user.role === UserRole.ADMIN;
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=user.types.js.map