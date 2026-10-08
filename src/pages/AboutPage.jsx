import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Target, Compass, Award, Users, ShieldCheck, CheckCircle } from 'lucide-react';

export const AboutPage = () => {
  const { t, demoStats, communityStories } = useApp();

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 50 }}>
      
      {/* About Header */}
      <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <span className="badge badge-verified" style={{ marginBottom: 12 }}>
          <Heart size={14} /> National Community Health Innovation
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 12 }}>
          About EK ASHA
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.6 }}>
          Transforming India's grassroots public healthcare by giving ASHA and ANM health workers dynamic data-driven visit prioritization and optimized travel intelligence.
        </p>
      </div>

      {/* Vision & Mission Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div className="card" style={{ borderTop: '4px solid var(--blue-accent)', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--navy-deep)', marginBottom: 12 }}>
            <div style={{ background: '#e0f2fe', padding: 10, borderRadius: 10, color: '#0284c7' }}>
              <Compass size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>OUR VISION</h3>
          </div>
          <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
            "A healthcare system where every community member receives timely attention based on need and risk."
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--teal-brand)', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--navy-deep)', marginBottom: 12 }}>
            <div style={{ background: '#ccfbf1', padding: 10, borderRadius: 10, color: '#0d9488' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>OUR MISSION</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.925rem', color: '#334155' }}>
            <li>✓ Support ASHA & ANM workers with automated risk scoring</li>
            <li>✓ Prioritize high-risk pregnant mothers & vulnerable elderly</li>
            <li>✓ Reduce redundant travel distances between villages</li>
            <li>✓ Connect citizens seamlessly with nearby PHCs & hospitals</li>
          </ul>
        </div>
      </div>

      {/* Animated Demo Impact Statistics */}
      <div style={{ background: 'var(--navy-deep)', color: '#fff', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: 700, letterSpacing: 1 }}>DEMO STATISTICS</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform Impact & Reach</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8' }}>{demoStats.patientsSupported}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Patients Supported</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981' }}>{demoStats.visitsCompleted}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Visits Completed</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f43f5e' }}>{demoStats.criticalPrioritized}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Critical Patients Prioritized</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b' }}>{demoStats.ashaWorkersEmpowered}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>ASHA/ANM Workers Empowered</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8' }}>{demoStats.travelTimeSaved}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Travel Time Saved</div>
          </div>
        </div>
      </div>

      {/* Community Stories */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 20 }}>
          Community Testimonials & Stories
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {communityStories.map(story => (
            <div key={story.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <img 
                src={story.image} 
                alt={story.name} 
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--blue-accent)', flexShrink: 0 }}
              />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2942' }}>{story.name}</h4>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginBottom: 8 }}>{story.role}</div>
                <p style={{ fontSize: '0.875rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{story.story}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ASHA / ANM Scope of Services Grid */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-deep)', marginBottom: 20 }}>
          ASHA & ANM Healthcare Scope
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            "Maternal & ANC Checkups",
            "Infant Immunization Support",
            "Severe Acute Malnutrition (SAM)",
            "Tuberculosis DOTS Follow-up",
            "Elderly Diabetes & BP Tracking",
            "Emergency Hospital Referral",
            "Vector Control & Dengue Survey",
            "Health Awareness & Counseling"
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14 }}>
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
