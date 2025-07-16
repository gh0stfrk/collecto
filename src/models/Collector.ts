import mongoose from 'mongoose'

const CollectorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  upiId: { type: String, required: true }
}, { timestamps: true })

export default mongoose.models.Collector || mongoose.model('Collector', CollectorSchema)