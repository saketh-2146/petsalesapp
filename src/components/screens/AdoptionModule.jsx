import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, ClipboardList, Clock, Star, StarOff, ShieldCheck, ChevronRight } from 'lucide-react';

export default function AdoptionModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    adoptions, 
    setAdoptions,
    pets 
  } = useContext(AppContext);

  // States
  const [selectedAdoptId, setSelectedAdoptId] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Pre-seed mock adoption requests if array is empty
  const defaultAdoptions = adoptions.length > 0 ? adoptions : [
    {
      id: 'adopt-seed-1',
      petId: 'pet-5',
      petName: 'Daisy',
      petImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=150&auto=format&fit=crop',
      price: 0,
      type: 'Adoption',
      status: 'Under Review', // Pending, Under Review, Home Visit, Interview, Approved, Completed
      createdDate: '2026-06-05',
      timeline: [
        { title: 'Application Submitted', description: 'Your application has been received and is waiting for owner review.', date: '2026-06-05', completed: true },
        { title: 'Owner Review', description: 'The pet owner is evaluating your housing and profile details.', date: '2026-06-07', completed: true },
        { title: 'Virtual Interview', description: 'Schedule a call to discuss house rules and pet adjustments.', date: '', completed: false },
        { title: 'Application Approved', description: 'Final agreements and vaccine certificate verification.', date: '', completed: false }
      ]
    }
  ];

  const activeRequest = defaultAdoptions.find(a => a.id === (selectedAdoptId || defaultAdoptions[0]?.id)) || defaultAdoptions[0];

  const handleTrackClick = (adoptId) => {
    setSelectedAdoptId(adoptId);
    setActiveScreen('AdoptionStatusTracking');
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackText('');
      setActiveScreen('HomeDashboard');
    }, 2000);
  };

  // Screen 40: My Adoption Requests
  if (activeScreen === 'MyAdoptionRequests') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Adoption Requests</h1>
          <button onClick={() => setActiveScreen('AdoptionHistory')} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>History</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {defaultAdoptions.map(req => (
            <div 
              key={req.id}
              onClick={() => handleTrackClick(req.id)}
              className="card"
              style={{ padding: '12px', display: 'flex', gap: '12px', position: 'relative', cursor: 'pointer' }}
            >
              <img src={req.petImage} alt={req.petName} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{req.petName}</h4>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: req.status === 'Completed' ? 'var(--accent-light)' : 'var(--primary-light)',
                    color: req.status === 'Completed' ? 'var(--accent)' : 'var(--primary)'
                  }}>
                    {req.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Submitted: {req.createdDate}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--primary)', fontSize: '0.72rem', marginTop: '6px', fontWeight: 'bold' }}>
                  <span>Track Status Timeline</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen 41: Adoption Status Tracking
  if (activeScreen === 'AdoptionStatusTracking') {
    if (!activeRequest) return null;

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.2rem' }}>Request Status</h1>
          <button onClick={() => setActiveScreen('MyAdoptionRequests')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>Back</button>
        </div>

        {/* Pet header panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <img src={activeRequest.petImage} alt={activeRequest.petName} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Application for {activeRequest.petName}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: 'var(--primary)' }}>{activeRequest.status}</strong></span>
          </div>
        </div>

        {/* Stepped Timeline component */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '10px', position: 'relative' }}>
          {/* Vertical line indicator */}
          <div style={{
            position: 'absolute',
            left: '20px', top: '10px', bottom: '10px',
            width: '2px',
            background: 'var(--border)',
            zIndex: 1
          }}></div>

          {activeRequest.timeline.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '16px', zIndex: 10 }}>
              {/* Node status bullet */}
              <div style={{
                width: '22px', height: '22px',
                borderRadius: '50%',
                background: step.completed ? 'var(--primary)' : 'var(--bg-card)',
                border: '2px solid',
                borderColor: step.completed ? 'var(--primary)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                marginTop: '2px'
              }}>
                {step.completed && <Check size={12} strokeWidth={3} />}
              </div>

              {/* Node Details text */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold', color: step.completed ? 'var(--text-main)' : 'var(--text-muted)' }}>{step.title}</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>{step.description}</p>
                {step.date && <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{step.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen 42: Adoption History
  if (activeScreen === 'AdoptionHistory') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Adoption History</h1>
          <button onClick={() => setActiveScreen('MyAdoptionRequests')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>Requests</button>
        </div>

        {feedbackSuccess ? (
          <div style={{ padding: '20px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <ShieldCheck size={40} style={{ margin: '0 auto 10px' }} />
            <h4 style={{ fontWeight: 'bold' }}>Feedback Submitted!</h4>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Thank you for writing a review to help verified breeders.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Historical Pet Card */}
            <div className="card" style={{ padding: '12px', display: 'flex', gap: '12px' }}>
              <img src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=150&auto=format&fit=crop" alt="Luna" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Luna (Siamese Cat)</h4>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Adopted: 2026-03-10</p>
                <span style={{ fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 'bold' }}>Status: Completed</span>
              </div>
            </div>

            {/* Breeder Review Form */}
            <form onSubmit={submitFeedback} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Write Breeder Review</h3>
              
              {/* Star Rating select */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(star => {
                  const filled = star <= rating;
                  return (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ background: 'none', padding: 0 }}
                    >
                      {filled ? <Star size={20} fill="#f59e0b" stroke="#f59e0b" /> : <StarOff size={20} style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  );
                })}
              </div>

              <textarea 
                placeholder="Share your experience with the adoption process..." 
                rows="4" 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                style={{ resize: 'none' }}
                required
              />

              <button type="submit" className="btn-primary" style={{ height: '40px' }}>Submit Feedback</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return null;
}
