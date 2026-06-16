import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, ArrowLeft, ArrowRight, Image as ImageIcon, Video, IndianRupee, MapPin, Eye, Settings, Trash2, Edit2, AlertCircle, Upload } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { petService } from '../../services/petService';

export default function SellingModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    setPets, 
    addPetListing,
    currentUser 
  } = useContext(AppContext);

  // Listing wizard states
  const [wzName, setWzName] = useState('');
  const [wzCategory, setWzCategory] = useState('Dogs');
  const [wzImages, setWzImages] = useState([]);
  const [wzVideo, setWzVideo] = useState('');
  const [wzBreed, setWzBreed] = useState('');
  const [wzAge, setWzAge] = useState('');
  const [wzGender, setWzGender] = useState('Male');
  const [wzColor, setWzColor] = useState('');
  const [wzDescription, setWzDescription] = useState('');
  const [wzPriceType, setWzPriceType] = useState('Sale'); // Sale vs Adoption
  const [wzPrice, setWzPrice] = useState('');
  const [wzLocation, setWzLocation] = useState('Mumbai, MH');
  const [wzContactEmail, setWzContactEmail] = useState('');
  const [wzContactPhone, setWzContactPhone] = useState('');
  const [wzVaccines, setWzVaccines] = useState('Fully Vaccinated');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [wizardSuccess, setWizardSuccess] = useState(false);

  // Demo presets for image select
  const IMAGE_PRESETS = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=300&auto=format&fit=crop'
  ];

  const handlePresetSelect = (url) => {
    if (wzImages.includes(url)) {
      setWzImages(prev => prev.filter(img => img !== url));
    } else {
      setWzImages(prev => [...prev, url]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    
    setIsUploading(true);
    const { publicUrl, error } = await storageService.uploadPetImage(file, currentUser.id);
    setIsUploading(false);

    if (error) {
      alert(`Upload failed: ${error}`);
      return;
    }

    if (publicUrl) {
      setWzImages(prev => [...prev, publicUrl]);
    }
  };

  const handlePublishListing = () => {
    const priceVal = wzPriceType === 'Adoption' ? 0 : Number(wzPrice || 0);
    const newPet = {
      name: wzName || 'Unnamed Pet',
      category: wzCategory,
      breed: wzBreed || 'Mixed Breed',
      age: wzAge || 'Puppy',
      ageMonths: 6,
      gender: wzGender,
      color: wzColor || 'Mixed',
      price: priceVal,
      type: wzPriceType,
      vaccinationStatus: wzVaccines,
      vaccines: [],
      healthRecords: {
        weight: '12 lbs',
        allergies: 'None',
        diet: 'Standard Kibbles',
        healthScore: 95,
        lastCheckup: new Date().toISOString().split('T')[0],
        vetNotes: 'Fully checked, active and healthy.'
      },
      location: wzLocation + ' (1.5 miles away)',
      distance: 1.5,
      contactInfo: {
        email: wzContactEmail || currentUser?.email || '',
        phone: wzContactPhone || currentUser?.phone || ''
      },
      images: wzImages.length > 0 ? wzImages : [IMAGE_PRESETS[0]],
      video: wzVideo,
      description: wzDescription || 'A loving pet looking for a great home.'
    };

    addPetListing(newPet);
    
    // Clear forms
    setWzName('');
    setWzImages([]);
    setWzVideo('');
    setWzBreed('');
    setWzAge('');
    setWzColor('');
    setWzDescription('');
    setWzPrice('');
    setWzContactEmail('');
    setWzContactPhone('');
    
    setWizardSuccess(true);
    setTimeout(() => {
      setWizardSuccess(false);
      setActiveScreen('SellerDashboard');
    }, 2500);
  };

  const handleDeleteListing = async (petId) => {
    // Delete from database
    const { error } = await petService.deletePet(petId);
    if (!error) {
      setPets(prev => prev.filter(p => p.id !== petId));
    } else {
      alert(`Delete failed: ${error}`);
    }
  };

  // Screen 25: Seller Dashboard
  if (activeScreen === 'SellerDashboard') {
    const sellerListings = pets.filter(p => p.owner?.id === currentUser?.id);
    const soldListings = pets.filter(p => p.owner?.id === currentUser?.id && p.status === 'Sold');

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        {/* Earnings panel */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), #a16207)', color: 'white', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '600' }}>TOTAL SELLER REVENUE</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'white', marginTop: '4px' }}>₹2,45,000</h2>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
            <div>
              <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>ACTIVE LISTINGS</span>
              <strong style={{ display: 'block', fontSize: '1rem', color: 'white' }}>{sellerListings.length}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>COMPLETED SALES</span>
              <strong style={{ display: 'block', fontSize: '1rem', color: 'white' }}>{soldListings.length}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
          <button 
            onClick={() => setActiveScreen('AddPetListing')}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px' }}
          >
            <Plus size={18} />
            <span>Add New Pet Listing</span>
          </button>
          <button 
            onClick={() => setActiveScreen('ManageListings')}
            className="btn-secondary" 
            style={{ height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
          >
            <Settings size={16} />
            <span>Manage</span>
          </button>
        </div>

        {/* Quick Incoming Requests simulation list */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Incoming Applications (2)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.82rem' }}>Adoption Application: Milo</strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>Adopter Review</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>From: Alex Rivera (Seattle, WA)</p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  onClick={() => alert('Application Approved! Notification sent.')}
                  style={{ background: 'var(--accent)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => alert('Application Rejected.')}
                  style={{ background: 'var(--bg-input)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Common Progress Bar layout helper for listing wizard
  const renderWizardHeader = (stepNum, stepTitle) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>Step {stepNum} of 6</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stepTitle}</span>
        </div>
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: `${(stepNum / 6) * 100}%`, background: 'var(--primary)', borderRadius: '2px', transition: 'all 0.3s' }}></div>
        </div>
      </div>
    );
  };

  // Screen 26: Add Pet Listing
  if (activeScreen === 'AddPetListing') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Create Pet Listing</h1>
        {renderWizardHeader(1, 'Pet Name & Type')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pet Name</span>
            <input 
              type="text" 
              placeholder="What do you call your pet?"
              value={wzName}
              onChange={(e) => setWzName(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Category</span>
            <select value={wzCategory} onChange={(e) => setWzCategory(e.target.value)}>
              <option value="Dogs">Dogs</option>
              <option value="Cats">Cats</option>
              <option value="Birds">Birds</option>
              <option value="Rabbits">Rabbits</option>
              <option value="Fish">Fish</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => setActiveScreen('UploadPetImages')}
          disabled={!wzName}
          className="btn-primary" 
          style={{ height: '48px', marginTop: 'auto', opacity: wzName ? 1 : 0.6 }}
        >
          Next Step
        </button>
      </div>
    );
  }

  // Screen 27: Upload Pet Images
  if (activeScreen === 'UploadPetImages') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Upload Images</h1>
        {renderWizardHeader(2, 'Photos Selection')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* File Picker simulation area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ border: '2px dashed var(--border)', padding: '30px', textAlign: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', cursor: 'pointer' }}
          >
            {isUploading ? (
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Uploading...</span>
            ) : (
              <>
                <Upload size={32} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Click to Upload Image</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>JPG, PNG up to 5MB</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>

          {/* Presets gallery */}
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginTop: '8px' }}>Select Preset Images:</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {IMAGE_PRESETS.map((p, i) => {
              const selected = wzImages.includes(p);
              return (
                <div 
                  key={i} 
                  onClick={() => handlePresetSelect(p)}
                  style={{ 
                    height: '50px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    position: 'relative',
                    border: selected ? '2.5px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <img src={p} alt="Preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {selected && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(217, 119, 6, 0.2)' }}></div>}
                </div>
              );
            })}
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Selected ({wzImages.length}) images.</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={() => setActiveScreen('AddPetListing')} className="btn-secondary" style={{ flex: 1, height: '48px' }}>Back</button>
          <button onClick={() => setActiveScreen('UploadPetVideos')} className="btn-primary" style={{ flex: 1, height: '48px' }}>Next Step</button>
        </div>
      </div>
    );
  }

  // Screen 28: Upload Pet Videos
  if (activeScreen === 'UploadPetVideos') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Upload Video</h1>
        {renderWizardHeader(3, 'Video Clip Upload')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ border: '2px dashed var(--border)', padding: '40px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)' }}>
            <Video size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>Choose Video Clip</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Upload MP4 files up to 20MB (Optional)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Paste Video Link (Optional)</span>
            <input 
              type="text" 
              placeholder="e.g. https://assets.mixkit.co/video.mp4"
              value={wzVideo}
              onChange={(e) => setWzVideo(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={() => setActiveScreen('UploadPetImages')} className="btn-secondary" style={{ flex: 1, height: '48px' }}>Back</button>
          <button onClick={() => setActiveScreen('EnterPetInfo')} className="btn-primary" style={{ flex: 1, height: '48px' }}>Next Step</button>
        </div>
      </div>
    );
  }

  // Screen 29: Enter Pet Information
  if (activeScreen === 'EnterPetInfo') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Enter Information</h1>
        {renderWizardHeader(4, 'Pet Specs & Metadata')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Breed</span>
            <input type="text" placeholder="e.g. Golden Retriever" value={wzBreed} onChange={(e) => setWzBreed(e.target.value)} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Age description</span>
            <input type="text" placeholder="e.g. 3 months" value={wzAge} onChange={(e) => setWzAge(e.target.value)} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Gender</span>
            <select value={wzGender} onChange={(e) => setWzGender(e.target.value)}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Color</span>
            <input type="text" placeholder="e.g. Brown & White" value={wzColor} onChange={(e) => setWzColor(e.target.value)} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Vaccines Status</span>
            <select value={wzVaccines} onChange={(e) => setWzVaccines(e.target.value)}>
              <option value="Fully Vaccinated">Fully Vaccinated</option>
              <option value="Partially Vaccinated">Partially Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </select>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Short Description</span>
            <textarea placeholder="Say something about your pet's personality..." rows="3" value={wzDescription} onChange={(e) => setWzDescription(e.target.value)} style={{ width: '100%', resize: 'none' }}></textarea>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => setActiveScreen('UploadPetVideos')} className="btn-secondary" style={{ flex: 1, height: '48px' }}>Back</button>
          <button onClick={() => setActiveScreen('SetPriceLocation')} className="btn-primary" style={{ flex: 1, height: '48px' }}>Next Step</button>
        </div>
      </div>
    );
  }

  // Screen 30: Set Price & Location
  if (activeScreen === 'SetPriceLocation') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Price & Location</h1>
        {renderWizardHeader(5, 'Financials & Mapping')}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Price choice */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Listing Type</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Sale', 'Adoption'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setWzPriceType(t)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem', fontWeight: '600',
                    border: '1px solid',
                    borderColor: wzPriceType === t ? 'var(--primary)' : 'var(--border)',
                    background: wzPriceType === t ? 'var(--primary-light)' : 'var(--bg-card)',
                    color: wzPriceType === t ? 'var(--primary)' : 'var(--text-main)'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {wzPriceType === 'Sale' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pricing Price (₹)</span>
            <div style={{ position: 'relative' }}>
              <IndianRupee size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="number" 
                placeholder="e.g. 15000" 
                value={wzPrice} 
                onChange={(e) => setWzPrice(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Location Address</span>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="e.g. Bellevue, WA" 
                value={wzLocation} 
                onChange={(e) => setWzLocation(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Contact Email</span>
            <input 
              type="email" 
              placeholder="e.g. seller@example.com" 
              value={wzContactEmail} 
              onChange={(e) => setWzContactEmail(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Contact Phone</span>
            <input 
              type="tel" 
              placeholder="e.g. +91 98765 43210" 
              value={wzContactPhone} 
              onChange={(e) => setWzContactPhone(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <button onClick={() => setActiveScreen('EnterPetInfo')} className="btn-secondary" style={{ flex: 1, height: '48px' }}>Back</button>
          <button onClick={() => setActiveScreen('ListingPreview')} className="btn-primary" style={{ flex: 1, height: '48px' }}>Next Step</button>
        </div>
      </div>
    );
  }

  // Screen 31: Listing Preview
  if (activeScreen === 'ListingPreview') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Listing Preview</h1>
        {renderWizardHeader(6, 'Final Approval check')}

        {wizardSuccess ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Plus size={36} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Listing Published!</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Your pet details have been saved to local database schemas and approved by system logs.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Card Preview container */}
            <div className="card">
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={wzImages[0] || IMAGE_PRESETS[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{wzName || 'Unnamed'}</h3>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {wzPriceType === 'Adoption' ? 'Adoption' : `₹${Number(wzPrice || 0).toLocaleString('en-IN')}`}
                  </strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{wzBreed || 'Breed'} • {wzAge || 'Age'} • {wzGender}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '6px' }}>
                  <MapPin size={12} style={{ color: 'var(--accent)' }} />
                  <span>{wzLocation}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>"{wzDescription || 'No description provided.'}"</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '10px', borderRadius: '8px', color: 'var(--primary)', fontSize: '0.72rem', marginTop: '8px' }}>
              <AlertCircle size={14} />
              <span>Review details carefully. Listings go live instantly upon verification.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button onClick={() => setActiveScreen('SetPriceLocation')} className="btn-secondary" style={{ flex: 1, height: '48px' }}>Back</button>
              <button onClick={handlePublishListing} className="btn-primary" style={{ flex: 1, height: '48px' }}>Publish Listing</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Screen 32: Manage Listings
  if (activeScreen === 'ManageListings') {
    const userPets = pets.filter(p => p.owner?.id === currentUser?.id);
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.2rem' }}>Manage Listings</h1>
          <button onClick={() => setActiveScreen('AddPetListing')} style={{ background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>+ New</button>
        </div>

        {userPets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: 'bold' }}>No listings created yet</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click "+ New" to add your first pet for sale or adoption.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {userPets.map(p => (
              <div 
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  gap: '12px'
                }}
              >
                <img src={p.images[0]} alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{p.name}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.breed} • {p.price === 0 ? 'Adoption' : `₹${p.price.toLocaleString('en-IN')}`}</span>
                  
                  <span style={{ 
                    display: 'inline-block', 
                    fontSize: '0.62rem', 
                    fontWeight: 'bold', 
                    marginTop: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: p.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : p.status === 'Available' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: p.status === 'Pending' ? '#eab308' : p.status === 'Available' ? '#22c55e' : '#ef4444'
                  }}>
                    {p.status === 'Pending' ? 'Pending Approval' : p.status}
                  </span>
                </div>
                
                {/* Manage Tools */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => { setSelectedPetId(p.id); setActiveScreen('PetDetails'); }}
                    style={{ background: 'var(--bg-input)', color: 'var(--text-main)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Eye size={12} />
                  </button>
                  <button 
                    onClick={() => handleDeleteListing(p.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'red', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
