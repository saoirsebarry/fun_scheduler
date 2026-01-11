// models/Discovery.js
const DiscoverySchema = new mongoose.Schema({
  relatedInterest: String, // e.g., 'Hiking'
  title: String,
  description: String,
  color: String,
  icon: String,
  userId: String, // Who is this recommendation for?
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discovery', DiscoverySchema);