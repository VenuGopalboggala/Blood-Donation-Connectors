import { Router } from 'express';
import Donor from '../models/Donor.js';
import SOS from '../models/SOS.js';
import Donation from '../models/Donation.js';
import Badge from '../models/Badge.js';
import DonorBadge from '../models/DonorBadge.js';
import Hospital from '../models/Hospital.js';
import { Op } from 'sequelize';

const router = Router();

// Helper: haversine distance calculation (returns km)
function haversineKm(lat1, lon1, lat2, lon2) {
  function toRad(x){return x * Math.PI / 180;}
  const R = 6371; // km
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// POST /api/features/match - body: { bloodType, lat, lng, radiusKm=50 }
router.post('/match', async (req, res) => {
  const { bloodType, lat, lng, radiusKm = 50 } = req.body;
  if (!bloodType || lat==null || lng==null) return res.status(400).json({ message: 'bloodType, lat and lng required' });
  try {
    const donors = await Donor.findAll({
      where: {
        bloodType,
        isAvailable: true
      }
    });
    const withDist = donors.map(d => {
      const dlat = parseFloat(d.lat) || 0;
      const dlng = parseFloat(d.lng) || 0;
      const dist = haversineKm(lat, lng, dlat, dlng);
      return { donor: d, distanceKm: dist };
    }).filter(x => x.distanceKm <= radiusKm)
      .sort((a,b)=>a.distanceKm - b.distanceKm);
    res.json(withDist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/features/sos - create SOS broadcast
router.post('/sos', async (req, res) => {
  try {
    const { requesterId, bloodType, lat, lng, message } = req.body;
    const sos = await SOS.create({ requesterId, bloodType, lat, lng, message });
    // naive "broadcast": find nearby donors and return them as 'notified'
    const donors = await Donor.findAll({
      where: {
        bloodType,
        isAvailable: true
      }
    });
    const notified = donors.map(d => {
      const dlat = parseFloat(d.lat) || 0;
      const dlng = parseFloat(d.lng) || 0;
      const dist = haversineKm(lat, lng, dlat, dlng);
      return { donor: d, distanceKm: dist };
    }).filter(x => x.distanceKm <= 50)
      .sort((a,b)=>a.distanceKm - b.distanceKm);
    res.status(201).json({ sos, notified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/features/donor/:id/availability  body: { isAvailable }
router.patch('/donor/:id/availability', async (req,res)=>{
  try{
    const donor = await Donor.findByPk(req.params.id);
    if(!donor) return res.status(404).json({message:'Donor not found'});
    donor.isAvailable = !!req.body.isAvailable;
    await donor.save();
    res.json(donor);
  }catch(err){res.status(500).json({message:err.message})}
});

// GET /api/features/donor/:id/history
router.get('/donor/:id/history', async (req,res)=>{
  try{
    const history = await Donation.findAll({ where: { donorId: req.params.id }, order: [['date','DESC']]});
    res.json(history);
  }catch(err){res.status(500).json({message:err.message})}
});

// POST /api/features/donor/:id/donate  body: { recipientId, notes, location }
// also awards badges for milestones (e.g., 5 donations)
router.post('/donor/:id/donate', async (req,res)=>{
  try{
    const donorId = req.params.id;
    const { recipientId, notes, location } = req.body;
    const donation = await Donation.create({ donorId, recipientId, notes, location });
    // update donor.lastDonationDate
    const donor = await Donor.findByPk(donorId);
    donor.lastDonationDate = donation.date;
    await donor.save();
    // count donations
    const count = await Donation.count({ where: { donorId }});
    // award badge if 5 donations
    if(count===5){
      // find/create badge "5 Donations"
      let badge = await Badge.findOne({ where: { name: '5 Donations' }});
      if(!badge) badge = await Badge.create({ name: '5 Donations', description: 'Completed 5 donations' });
      await DonorBadge.create({ donorId, badgeId: badge.id });
    }
    res.status(201).json({ donation, badgeAwarded: count===5 });
  }catch(err){res.status(500).json({message:err.message})}
});

// Hospitals endpoints: POST /api/features/hospitals (create), PATCH /api/features/hospitals/:id/verify
router.post('/hospitals', async (req,res)=>{
  try{
    const h = await Hospital.create(req.body);
    res.status(201).json(h);
  }catch(err){res.status(500).json({message:err.message})}
});
router.patch('/hospitals/:id/verify', async (req,res)=>{
  try{
    const h = await Hospital.findByPk(req.params.id);
    if(!h) return res.status(404).json({message:'Hospital not found'});
    h.verified = !!req.body.verified;
    await h.save();
    res.json(h);
  }catch(err){res.status(500).json({message:err.message})}
});

export default router;
