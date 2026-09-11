import mongoose from 'mongoose';

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    startingPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', maxlength: 6 },
    billingUnit: { type: String, default: 'project', maxlength: 40 },
    features: [{ type: String, trim: true, maxlength: 200 }],
    exclusions: [{ type: String, trim: true, maxlength: 200 }],
    timeline: { type: String, default: '', maxlength: 120 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pricingPlanSchema.index({ active: 1, order: 1 });

export const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);
