import mongoose from 'mongoose';
import { IPrescription } from '../types/prescription.types';
declare const Prescription: mongoose.Model<IPrescription, {}, {}, {}, mongoose.Document<unknown, {}, IPrescription, {}, {}> & IPrescription & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export { Prescription };
//# sourceMappingURL=Prescription.model.d.ts.map