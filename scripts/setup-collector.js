const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

const CollectorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  upiId: { type: String, required: true }
}, { timestamps: true })

const Collector = mongoose.model('Collector', CollectorSchema)

async function createCollector() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')

    const username = ''                     // Add your username
    const collectorName = ''                // Your name 'Jane Doe'
    const upiId = ''                        // Your UPI Id
    const password = ''                     // Create a password to login to this application

    const passwordHash = await bcrypt.hash('password123', 12)

    const collector = new Collector({
      username: username,
      name: collectorName,
      passwordHash,
      upiId: upiId
    })

    await collector.save()
    
    console.log('Collector created successfully!')
    console.log(`Username > ${username}`)
    console.log(`Name > ${collectorName}`)
    console.log(`Password > ${password}`)
    console.log(`UPI ID > ${upiId}`)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

createCollector()