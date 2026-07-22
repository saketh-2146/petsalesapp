import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, Heart, Info, FileText, ChevronRight, User, Phone, Mail, Award, Download, CheckCircle, Video } from 'lucide-react';

export default function DetailsModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    selectedPetId, 
    favorites, 
    toggleFavorite,
    submitAdoptionRequest,
    startChat,
    currentUser,
    updatePetStatus
  } = useContext(AppContext);

  // Active pet context reference
  const pet = pets.find(p => p.id === selectedPetId) || pets[0];

  // Component states
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Adoption Form State
  const [housing, setHousing] = useState('Rent');
  const [yardSpace, setYardSpace] = useState('Yes');
  const [experience, setExperience] = useState('First Time');
  const [hoursAway, setHoursAway] = useState('2-4 hours');
  const [agreement, setAgreement] = useState(false);

  // Purchase Form State
  const [deliveryPref, setDeliveryPref] = useState('Local Pickup');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScreen]);

  const handleOwnerClick = () => {
    setActiveScreen('PetOwnerProfile');
  };

  const handleAdoptionSubmit = (e) => {
    e.preventDefault();
    if (!agreement) return;

    submitAdoptionRequest(pet.id, { housing, yardSpace, experience, hoursAway });
    setActiveScreen('MyAdoptionRequests');
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) return;

    // Proceed to Checkout setup
    setActiveScreen('CheckoutScreen');
  };

  if (!pet) return null;

  // Screen 19: Pet Details
  if (activeScreen === 'PetDetails') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '70px' }} className="animate-fade-in">
        {/* Media Frame Carousel */}
        <div style={{ position: 'relative', height: '240px', background: '#e2e8f0' }}>
          {showVideo && pet.video ? (
            <video 
              src={pet.video} 
              autoPlay controls loop 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <img 
              src={pet.images[activeImgIndex]} 
              alt={pet.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}

          {/* Media Toggles */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
            {pet.images.map((_, idx) => (
              <span 
                key={idx}
                onClick={() => { setActiveImgIndex(idx); setShowVideo(false); }}
                style={{
                  width: activeImgIndex === idx && !showVideo ? '20px' : '6px',
                  height: '6px',
                  background: 'white',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  opacity: activeImgIndex === idx && !showVideo ? 1 : 0.6,
                  transition: 'all 0.25s'
                }}
              ></span>
            ))}
            {pet.video && (
              <button 
                onClick={() => setShowVideo(true)}
                style={{
                  background: showVideo ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.55rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  height: '14px',
                  marginTop: '-4px'
                }}
              >
                <Video size={8} /> Video
              </button>
            )}
          </div>

          {/* Favorite Toggle button */}
          <button 
            onClick={() => toggleFavorite(pet.id)}
            style={{
              position: 'absolute',
              top: '16px', right: '16px',
              background: 'white',
              borderRadius: '50%',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              color: favorites.includes(pet.id) ? 'red' : 'var(--text-muted)'
            }}
          >
            <Heart size={18} fill={favorites.includes(pet.id) ? 'red' : 'none'} />
          </button>
        </div>

        {/* Pet Name Block */}
        <div style={{ padding: '16px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem' }}>{pet.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>{pet.breed} • {pet.location.split('(')[0]}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', display: 'block' }}>
                {pet.price === 0 ? 'Free Adoption' : `₹${pet.price.toLocaleString('en-IN')}`}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{pet.type} listing</span>
            </div>
          </div>

          {/* Specs tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Age</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', marginTop: '2px', display: 'block' }}>{pet.age}</span>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Gender</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', marginTop: '2px', display: 'block' }}>{pet.gender}</span>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Color</span>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', marginTop: '2px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{pet.color}</span>
            </div>
          </div>
        </div>

        {/* Action Link Lists */}
        <div style={{ padding: '8px 16px', background: 'var(--bg-card)', marginTop: '8px', borderBottom: '1px solid var(--border)' }}>
          <div 
            onClick={() => setActiveScreen('PetHealthDetails')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={16} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Health & Diet Monitoring Records</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Score: {pet.healthRecords.healthScore}%</span>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div 
            onClick={() => setActiveScreen('PetVaccinationDetails')}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={16} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Vaccination Log Details</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pet.vaccinationStatus}</span>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        {/* Owner brief */}
        <div style={{ padding: '16px', background: 'var(--bg-card)', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={handleOwnerClick}>
            <img src={pet.owner.avatar} alt={pet.owner.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{pet.owner.name}</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Seller • ⭐ {pet.owner.rating} ({pet.owner.reviewsCount} reviews)</p>
            </div>
          </div>
          <button onClick={handleOwnerClick} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: '700' }}>
            Profile
          </button>
        </div>

        {/* Description */}
        <div style={{ padding: '16px', background: 'var(--bg-card)', marginTop: '8px' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 'bold', marginBottom: '8px' }}>Description</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{pet.description}</p>
        </div>

        {/* Bottom Actions Floating Bar */}
        <div style={{
          position: 'absolute', bottom: '60px', left: 0, right: 0,
          background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
          padding: '12px 16px', display: 'flex', gap: '12px', zIndex: 100
        }}>
          {pet.status === 'Pending' ? (
            <>
              <button 
                onClick={async () => {
                  await updatePetStatus(pet.id, 'Rejected');
                  alert('Listing rejected!');
                  setActiveScreen('AdminDashboard');
                }}
                className="btn-secondary" 
                style={{ flex: 1, height: '44px', fontSize: '0.85rem', color: 'red' }}
              >
                Reject
              </button>
              <button 
                onClick={async () => {
                  await updatePetStatus(pet.id, 'Available');
                  alert('Listing approved!');
                  setActiveScreen('AdminDashboard');
                }}
                className="btn-primary" 
                style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}
              >
                Approve Listing
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={async () => {
                  if (currentUser) {
                    const phone = pet.contactInfo?.phone || pet.owner?.phone || "Not provided";
                    const email = pet.contactInfo?.email || pet.owner?.email || "Not provided";
                    alert(`Owner Details:\nName: ${pet.owner?.name || "Owner"}\nMobile: ${phone}\nEmail: ${email}`);
                  } else {
                    alert("Please login to contact the owner.");
                    setActiveScreen('Login');
                  }
                }}
                className="btn-secondary" 
                style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}
              >
                Contact Owner
              </button>
              
              {pet.type === 'Adoption' ? (
                <button 
                  onClick={() => setActiveScreen('AdoptionRequestForm')}
                  className="btn-primary" 
                  style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}
                >
                  Adopt Now
                </button>
              ) : (
                <button 
                  onClick={() => setActiveScreen('PurchaseRequestForm')}
                  className="btn-primary" 
                  style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}
                >
                  Buy Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Screen 20: Pet Health Details
  if (activeScreen === 'PetHealthDetails') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Health & Care Logs</h1>

        {/* Overall Health Card */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent), #0f766e)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: '700' }}>Overall Health Index</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>{pet.healthRecords.healthScore}%</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '4px' }}>Verified veterinarian approved status</p>
          </div>
          <ShieldCheck size={48} style={{ opacity: 0.8 }} />
        </div>

        {/* Physical Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>WEIGHT TREND</span>
            <strong style={{ fontSize: '1.1rem', marginTop: '2px', display: 'block' }}>{pet.healthRecords.weight}</strong>
            
            {/* Visual SVG Weight Tracker Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '30px', marginTop: '10px' }}>
              <div style={{ height: '30%', width: '10px', background: 'var(--accent)', borderRadius: '2px' }}></div>
              <div style={{ height: '55%', width: '10px', background: 'var(--accent)', borderRadius: '2px' }}></div>
              <div style={{ height: '75%', width: '10px', background: 'var(--accent)', borderRadius: '2px' }}></div>
              <div style={{ height: '100%', width: '10px', background: 'var(--accent)', borderRadius: '2px' }}></div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>LAST CHECKUP</span>
            <strong style={{ fontSize: '0.9rem', marginTop: '2px', display: 'block' }}>{pet.healthRecords.lastCheckup}</strong>
            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '8px' }}>Schedule: Annual preventative check complete.</p>
          </div>
        </div>

        {/* Diet & Allergies details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Dietary Program</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pet.healthRecords.diet}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#b91c1c', marginBottom: '4px' }}>Known Allergies / Sensitivities</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pet.healthRecords.allergies}</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>Veterinary Notes</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{pet.healthRecords.vetNotes}</p>
          </div>
        </div>
      </div>
    );
  }

  // Screen 21: Pet Vaccination Details
  if (activeScreen === 'PetVaccinationDetails') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Vaccination Log</h1>

        {pet.vaccines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: 'bold' }}>No vaccination requirements found</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Usually applicable to older dogs and cats only.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pet.vaccines.map((v, i) => (
              <div 
                key={i}
                style={{
                  padding: '14px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{v.name}</h3>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Batch: {v.batch || 'Pending'}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Date: {v.date || 'TBD'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: '99px',
                    background: v.status === 'Completed' ? 'var(--accent-light)' : 'var(--primary-light)',
                    color: v.status === 'Completed' ? 'var(--accent)' : 'var(--primary)'
                  }}>
                    {v.status}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated certificate downloads */}
            <button 
              onClick={() => alert('Certificate downloaded to device! (Simulated download)')}
              className="btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px', marginTop: '10px' }}
            >
              <Download size={16} />
              <span>Download Health Certificate</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Screen 22: Pet Owner Profile
  if (activeScreen === 'PetOwnerProfile') {
    const ownerPets = pets.filter(p => p.owner?.id === pet.owner?.id);
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
          <img src={pet.owner.avatar} alt={pet.owner.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
              <span>{pet.owner.name}</span>
              {pet.owner.verified && <CheckCircle size={16} style={{ color: 'var(--accent)' }} fill="var(--accent-light)" />}
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified breeder & adoption partner</span>
          </div>

          {/* Review indicators */}
          <div style={{ display: 'flex', gap: '20px', background: 'var(--bg-card)', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: '100%' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>RATING</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>⭐ {pet.owner.rating}</strong>
            </div>
            <div style={{ borderRight: '1px solid var(--border)' }}></div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold' }}>REVIEWS</span>
              <strong style={{ fontSize: '1.1rem' }}>{pet.owner.reviewsCount}</strong>
            </div>
          </div>
        </div>

        {/* Contact panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <Phone size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem' }}>{pet.contactInfo?.phone || pet.owner.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <Mail size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem' }}>{pet.contactInfo?.email || pet.owner.email}</span>
          </div>
        </div>

        {/* Active Listings feed */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Other Listings ({ownerPets.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ownerPets.map(p => (
              <div 
                key={p.id}
                onClick={() => { setSelectedPetId(p.id); setActiveScreen('PetDetails'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'var(--bg-card)',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <img src={p.images[0]} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{p.name}</h4>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{p.breed} • {p.price === 0 ? 'Adoption' : `₹${p.price.toLocaleString('en-IN')}`}</p>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 23: Adoption Request Form
  if (activeScreen === 'AdoptionRequestForm') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '1.25rem' }}>Adoption Application</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>Applying to adopt: <strong style={{ color: 'var(--text-main)' }}>{pet.name}</strong></p>
        </div>

        <form onSubmit={handleAdoptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Housing Choice */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Housing Status</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Own', 'Rent', 'Apartment'].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHousing(h)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem', fontWeight: '600',
                    border: '1px solid',
                    borderColor: housing === h ? 'var(--primary)' : 'var(--border)',
                    background: housing === h ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: housing === h ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Yard Space */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Do you have yard/outdoor space?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Yes', 'No', 'Shared Space'].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYardSpace(y)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem', fontWeight: '600',
                    border: '1px solid',
                    borderColor: yardSpace === y ? 'var(--primary)' : 'var(--border)',
                    background: yardSpace === y ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: yardSpace === y ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pet Ownership Experience</span>
            <select value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="First Time">First-time Pet Owner</option>
              <option value="Experienced">Experienced Owner</option>
              <option value="Multi-Pet">Own other pets currently</option>
            </select>
          </div>

          {/* Hours Away */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Daily Hours Pet Will Be Alone</span>
            <select value={hoursAway} onChange={(e) => setHoursAway(e.target.value)}>
              <option value="Less than 2 hours">Less than 2 hours</option>
              <option value="2-4 hours">2 to 4 hours</option>
              <option value="4-8 hours">4 to 8 hours</option>
              <option value="8+ hours">8+ hours</option>
            </select>
          </div>

          {/* Agreements */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '4px 0' }}>
            <input 
              type="checkbox" 
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
              style={{ width: '18px', height: '18px', padding: 0, marginTop: '2px' }}
              required 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              I agree to home inspection visits if requested and confirm all profile records are truthful.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ height: '48px', marginTop: '10px' }}
          >
            Submit Application
          </button>
        </form>
      </div>
    );
  }

  // Screen 24: Purchase Request Form
  if (activeScreen === 'PurchaseRequestForm') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '1.25rem' }}>Purchase Offer Form</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>Completing purchase for: <strong style={{ color: 'var(--text-main)' }}>{pet.name}</strong></p>
        </div>

        {/* Pricing Details */}
        <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Pet Listing Price:</span>
            <strong>₹{pet.price.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Escrow Security Fee:</span>
            <span>₹150</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 'bold' }}>
            <span>Total Offer:</span>
            <span style={{ color: 'var(--primary)' }}>₹{(pet.price + 150).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handlePurchaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Shipping choices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Delivery / Handover Preference</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Local Pickup', 'Breeder Delivery', 'Pet Air Freight'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeliveryPref(d)}
                  style={{
                    flex: 1, padding: '10px 4px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.72rem', fontWeight: '600',
                    border: '1px solid',
                    borderColor: deliveryPref === d ? 'var(--primary)' : 'var(--border)',
                    background: deliveryPref === d ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: deliveryPref === d ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <input 
              type="checkbox" 
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: '18px', height: '18px', padding: 0, marginTop: '2px' }}
              required 
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              I agree to the secure escrow terms. Payments are held in custody until I confirm receiving the pet.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ height: '48px', marginTop: '10px' }}
          >
            Go to Checkout
          </button>
        </form>
      </div>
    );
  }

  return null;
}
