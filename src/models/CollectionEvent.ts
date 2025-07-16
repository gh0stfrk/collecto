import mongoose from 'mongoose'

const PayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { 
    type: String, 
    enum: ['not_paid', 'pending_verification', 'paid'], 
    default: 'not_paid' 
  },
  paymentTimestamp: { type: Date },
  verificationTimestamp: { type: Date }
})

const CollectionEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  slug: { type: String, required: true },
  amount: { type: Number, required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collector', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  payers: [PayerSchema]
}, { timestamps: true })

export default mongoose.models.CollectionEvent || mongoose.model('CollectionEvent', CollectionEventSchema)