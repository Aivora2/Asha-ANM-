const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mockData.json', 'utf8'));

const newFacilities = [
  {
    "id": "h-08",
    "name": "Govt Dispensary Pratap Nagar",
    "type": "Government Dispensary",
    "verified": true,
    "lat": 26.8065,
    "lng": 75.8045,
    "address": "Sector 7, Pratap Nagar, Jaipur 302033",
    "distance": "4.8 km",
    "phone": "0141-2772210",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Free OPD", "Basic Medicines", "Dressings", "BP Check", "Blood Sugar Test"],
    "doctors": [
      {"name": "Dr. Pradeep Yadav", "specialty": "General Physician", "available": "09:00 AM - 01:00 PM"}
    ]
  },
  {
    "id": "h-09",
    "name": "Sub Health Centre Kalwad Road",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.7680,
    "lng": 75.8250,
    "address": "Kalwad Road, Near Sitapura Extension, Jaipur",
    "distance": "2.1 km",
    "phone": "0141-2775531",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["ANC / PNC", "Immunization", "ASHA Reporting Hub", "Maternal Health"],
    "doctors": [
      {"name": "Dr. Rekha Sharma", "specialty": "Community Health Officer", "available": "09:30 AM - 01:30 PM"}
    ]
  },
  {
    "id": "h-10",
    "name": "PHC Jamdoli",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.8320,
    "lng": 75.8590,
    "address": "Jamdoli Village, Agra Road, Jaipur 302031",
    "distance": "8.2 km",
    "phone": "0141-2680041",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["OPD", "Immunization", "ANC Checkups", "TB DOTS", "Family Planning"],
    "doctors": [
      {"name": "Dr. Hemant Lal", "specialty": "Medical Officer", "available": "10:00 AM - 02:00 PM"}
    ]
  },
  {
    "id": "h-11",
    "name": "Govt Hospital Sanganer",
    "type": "Government Specialty Hospital",
    "verified": true,
    "lat": 26.7998,
    "lng": 75.7918,
    "address": "Near Bus Stand, Sanganer, Jaipur 302029",
    "distance": "6.3 km",
    "phone": "0141-2730108",
    "emergency24x7": true,
    "icuBedsAvailable": 10,
    "services": ["General Surgery", "Maternal Health", "Emergency", "Free Medicines", "X-Ray"],
    "doctors": [
      {"name": "Dr. Suresh Meena", "specialty": "General Surgeon", "available": "08:00 AM - 02:00 PM"},
      {"name": "Dr. Anita Parihar", "specialty": "Gynecologist", "available": "09:00 AM - 01:00 PM"}
    ]
  },
  {
    "id": "h-12",
    "name": "Jan Aushadhi Store – Pratap Nagar",
    "type": "Pharmacy / Govt Generic Medicine",
    "verified": true,
    "lat": 26.8072,
    "lng": 75.8062,
    "address": "Sector 12, Pratap Nagar, Jaipur 302033",
    "distance": "5.1 km",
    "phone": "+91 94600 88211",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Generic Medicines", "Diabetic Strips", "Maternal Supplements", "ORS Sachets"],
    "doctors": []
  },
  {
    "id": "h-13",
    "name": "Sub-District Hospital Goner Road",
    "type": "Government Specialty Hospital",
    "verified": true,
    "lat": 26.7890,
    "lng": 75.8720,
    "address": "Goner Road, Near Ramnagariya, Jaipur 302031",
    "distance": "6.1 km",
    "phone": "0141-2680311",
    "emergency24x7": true,
    "icuBedsAvailable": 8,
    "services": ["Emergency OPD", "Delivery Room", "Blood Bank", "Child Care", "Dialysis"],
    "doctors": [
      {"name": "Dr. Mukesh Vyas", "specialty": "Emergency Medicine", "available": "24 Hours On-Call"},
      {"name": "Dr. Seema Joshi", "specialty": "Obstetrics", "available": "09:00 AM - 04:00 PM"}
    ]
  },
  {
    "id": "h-14",
    "name": "PHC Sitapura Sector 4",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.7810,
    "lng": 75.8190,
    "address": "Sector 4, Sitapura Industrial Area, Jaipur",
    "distance": "1.0 km",
    "phone": "0141-2771655",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["OPD", "Immunization", "ANC", "Family Planning", "TB Screening"],
    "doctors": [
      {"name": "Dr. Pooja Agarwal", "specialty": "Medical Officer", "available": "09:00 AM - 02:00 PM"}
    ]
  },
  {
    "id": "h-15",
    "name": "Janani Suraksha Kendra Beelwa",
    "type": "Maternity Centre",
    "verified": true,
    "lat": 26.7862,
    "lng": 75.8421,
    "address": "Beelwa Village Health Centre, Jaipur",
    "distance": "3.2 km",
    "phone": "+91 98290 44521",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Safe Delivery", "ANC / PNC", "JSY Scheme", "Newborn Care", "ASHA Coordination"],
    "doctors": [
      {"name": "ANM Geeta Devi", "specialty": "Auxiliary Nurse Midwife", "available": "08:00 AM - 04:00 PM"}
    ]
  },
  {
    "id": "h-16",
    "name": "Govt Pharmacy Sitapura Gate",
    "type": "Pharmacy / Govt Generic Medicine",
    "verified": true,
    "lat": 26.7742,
    "lng": 75.8298,
    "address": "Main Gate, Sitapura Industrial Area, Jaipur",
    "distance": "0.5 km",
    "phone": "+91 94141 22310",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Essential Medicines", "Iron-Folic Acid", "ORS", "Contraceptives", "BP Strips"],
    "doctors": []
  },
  {
    "id": "h-17",
    "name": "PHC Ramnagariya",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.7910,
    "lng": 75.8680,
    "address": "Ramnagariya Road, Near Goner Crossing, Jaipur 302031",
    "distance": "5.4 km",
    "phone": "0141-2680212",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["ANC / PNC", "Child Immunization", "ASHA Hub", "Malaria Screening"],
    "doctors": [
      {"name": "Dr. Ranjit Kumar", "specialty": "Medical Officer", "available": "09:00 AM - 01:00 PM"}
    ]
  },
  {
    "id": "h-18",
    "name": "Govt Eye Hospital Pratap Nagar",
    "type": "Government Specialty Hospital",
    "verified": true,
    "lat": 26.8092,
    "lng": 75.8105,
    "address": "Sector 22, Pratap Nagar, Jaipur 302033",
    "distance": "5.0 km",
    "phone": "0141-2795100",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Cataract Surgery", "Glaucoma OPD", "Free Eye Check", "Vision Aids", "Low Vision Clinic"],
    "doctors": [
      {"name": "Dr. Narendra Gupta", "specialty": "Ophthalmologist", "available": "09:00 AM - 02:00 PM"}
    ]
  },
  {
    "id": "h-19",
    "name": "Urban PHC Kacchi Basti Sitapura",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.7800,
    "lng": 75.8360,
    "address": "Kacchi Basti Colony, Sector 5, Sitapura, Jaipur",
    "distance": "1.8 km",
    "phone": "0141-2779900",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Free OPD", "Immunization", "ASHA Reporting", "Maternal Health", "Nutrition Counselling"],
    "doctors": [
      {"name": "Dr. Lalita Kumari", "specialty": "Medical Officer (Urban Health)", "available": "09:00 AM - 01:00 PM"}
    ]
  },
  {
    "id": "h-20",
    "name": "Atal Jan Aushadhi Sector 9 Sitapura",
    "type": "Pharmacy / Govt Generic Medicine",
    "verified": true,
    "lat": 26.7755,
    "lng": 75.8400,
    "address": "Sector 9, RIICO Sitapura, Jaipur",
    "distance": "1.9 km",
    "phone": "+91 97843 11009",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["Generic Medicines", "Maternal Supplements", "Paediatric Syrups", "Bandages and First Aid"],
    "doctors": []
  },
  {
    "id": "h-21",
    "name": "Govt Maternity Centre Sanganer",
    "type": "Maternity Centre",
    "verified": true,
    "lat": 26.8048,
    "lng": 75.7975,
    "address": "Near Hanuman Mandir, Sanganer, Jaipur 302029",
    "distance": "6.8 km",
    "phone": "0141-2731005",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["ANC Checkup", "Safe Delivery", "PNC Visit", "Janani Shishu Suraksha", "Immunization"],
    "doctors": [
      {"name": "Dr. Bina Sharma", "specialty": "Obstetrician", "available": "09:00 AM - 02:00 PM"}
    ]
  },
  {
    "id": "h-22",
    "name": "PHC Goner",
    "type": "Primary Health Centre (PHC)",
    "verified": true,
    "lat": 26.8010,
    "lng": 75.8810,
    "address": "Goner Village, Agra Road, Jaipur 302031",
    "distance": "9.1 km",
    "phone": "0141-2680088",
    "emergency24x7": false,
    "icuBedsAvailable": 0,
    "services": ["OPD", "Immunization", "Malaria Test", "ANC", "TB DOTS"],
    "doctors": [
      {"name": "Dr. Anil Sharma", "specialty": "Medical Officer", "available": "09:00 AM - 01:30 PM"}
    ]
  }
];

// Add all to existing array
data.healthcareFacilities.push(...newFacilities);

fs.writeFileSync('src/data/mockData.json', JSON.stringify(data, null, 2));
console.log('Total facilities now:', data.healthcareFacilities.length);
