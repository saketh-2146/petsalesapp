import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Brain, Sparkles, AlertCircle, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function AIRecommendationModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    aiPreferences, 
    setAiPreferences,
    setSelectedPetId,
    selectedPetId 
  } = useContext(AppContext);

  // Quiz steps state
  const [quizStep, setQuizStep] = useState(1);
  const [prefCategory, setPrefCategory] = useState(aiPreferences.preferredCategory);
  const [prefHousing, setPrefHousing] = useState(aiPreferences.housing);
  const [prefActivity, setPrefActivity] = useState(aiPreferences.activityLevel);
  const [prefKids, setPrefKids] = useState(aiPreferences.hasChildren);

  const matchedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  const handlePreferencesSubmit = () => {
    setAiPreferences({
      preferredCategory: prefCategory,
      housing: prefHousing,
      activityLevel: prefActivity,
      hasChildren: prefKids,
      workHours: '4-8 hours',
      hasOtherPets: false
    });
    setQuizStep(1);
    setActiveScreen('AIRecommendedPets');
  };

  // Helper matching calculation to output realistic score
  const getMatchScore = (petRecord) => {
    let base = 85;
    if (petRecord.category === aiPreferences.preferredCategory) base += 8;
    if (aiPreferences.housing === 'Apartment' && ['Dogs'].includes(petRecord.category) && petRecord.healthRecords.weight.includes('65')) {
      base -= 10; // Large dog in apartment reduces score
    }
    if (aiPreferences.activityLevel === 'High' && petRecord.breed.includes('Retriever')) base += 5;
    if (aiPreferences.hasChildren && petRecord.name === 'Cleo') base -= 15; // Persian cat hates loud noises
    return Math.min(99, Math.max(60, base));
  };

  // Screen 37: Pet Preference Quiz Form
  if (activeScreen === 'PetPreferenceForm') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <div>
          <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Brain style={{ color: 'var(--primary)' }} size={22} />
            <span>AI Match Quiz</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>Find a pet that fits your lifestyle perfectly</p>
        </div>

        {/* Wizard Deck */}
        <div className="card" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {quizStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>1. What species are you looking for?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Dogs', 'Cats', 'Rabbits', 'Birds', 'Fish'].map(c => (
                  <button
                    key={c}
                    onClick={() => setPrefCategory(c)}
                    style={{
                      padding: '16px', borderRadius: '12px',
                      fontSize: '0.82rem', fontWeight: 'bold',
                      border: '1.5px solid',
                      borderColor: prefCategory === c ? 'var(--primary)' : 'var(--border)',
                      background: prefCategory === c ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: prefCategory === c ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>2. Describe your housing environment</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Apartment (No Yard)', 'Townhouse (Small Yard)', 'House (Large Fenced Yard)'].map(h => (
                  <button
                    key={h}
                    onClick={() => setPrefHousing(h)}
                    style={{
                      padding: '14px', borderRadius: '12px',
                      fontSize: '0.82rem', fontWeight: 'bold',
                      textAlign: 'left',
                      border: '1.5px solid',
                      borderColor: prefHousing === h ? 'var(--primary)' : 'var(--border)',
                      background: prefHousing === h ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: prefHousing === h ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>3. How active is your lifestyle?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Low (Short walks)', 'Moderate (Daily play)', 'High (Jogging & hikes)'].map(act => (
                  <button
                    key={act}
                    onClick={() => setPrefActivity(act)}
                    style={{
                      padding: '14px', borderRadius: '12px',
                      fontSize: '0.82rem', fontWeight: 'bold',
                      textAlign: 'left',
                      border: '1.5px solid',
                      borderColor: prefActivity === act ? 'var(--primary)' : 'var(--border)',
                      background: prefActivity === act ? 'var(--primary-light)' : 'var(--bg-card)',
                      color: prefActivity === act ? 'var(--primary)' : 'var(--text-main)'
                    }}
                  >
                    {act}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
                <input 
                  type="checkbox" 
                  checked={prefKids} 
                  onChange={(e) => setPrefKids(e.target.checked)} 
                  style={{ width: '18px', height: '18px', padding: 0 }} 
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Are children present in the house?</span>
              </div>
            </div>
          )}

          {/* Navigation inside card */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '20px' }}>
            {quizStep > 1 && (
              <button onClick={() => setQuizStep(prev => prev - 1)} className="btn-secondary" style={{ flex: 1 }}>Back</button>
            )}
            {quizStep < 3 ? (
              <button onClick={() => setQuizStep(prev => prev + 1)} className="btn-primary" style={{ flex: 1 }}>Continue</button>
            ) : (
              <button onClick={handlePreferencesSubmit} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>Calculate Match</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Screen 38: AI Recommended Pets
  if (activeScreen === 'AIRecommendedPets') {
    // Sort pets by dynamic matching score
    const matchedList = pets
      .map(p => ({ ...p, score: getMatchScore(p) }))
      .sort((a, b) => b.score - a.score);

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles style={{ color: 'var(--primary)' }} size={20} />
              <span>AI Matches</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>Best pets matching your lifestyle parameters</p>
          </div>
          <button onClick={() => setActiveScreen('PetPreferenceForm')} style={{ background: 'var(--bg-input)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Retake Quiz</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {matchedList.map(pet => (
            <div 
              key={pet.id}
              onClick={() => { setSelectedPetId(pet.id); setActiveScreen('AICompatibilityScore'); }}
              className="card"
              style={{ padding: '12px', display: 'flex', gap: '12px', position: 'relative', cursor: 'pointer' }}
            >
              <img src={pet.images[0]} alt={pet.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>{pet.name}</h4>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: pet.score >= 90 ? 'var(--accent-light)' : 'var(--primary-light)',
                    color: pet.score >= 90 ? 'var(--accent)' : 'var(--primary)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {pet.score}% Match
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pet.breed} • {pet.age}</p>
                
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.62rem' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Why it matches:</span>
                  <span>Fits activity & house preferences</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen 39: AI Compatibility Score Breakdown
  if (activeScreen === 'AICompatibilityScore') {
    const finalScore = getMatchScore(matchedPet);

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.25rem' }}>Compatibility Score</h1>
          <button onClick={() => setActiveScreen('AIRecommendedPets')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>Back to list</button>
        </div>

        {/* Big Score circle chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 0' }}>
          <div style={{
            width: '120px', height: '120px',
            borderRadius: '50%',
            border: '8px solid var(--primary-light)',
            borderTopColor: 'var(--primary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center',
            fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)',
            paddingTop: '32px'
          }}>
            <span>{finalScore}%</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>Match Index</span>
          </div>
          <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>Excellent Match for {matchedPet.name}!</strong>
        </div>

        {/* Details Alignment bar charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>Parameter Breakdown</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600' }}>
              <span style={{ color: 'var(--text-muted)' }}>Activity Alignment</span>
              <span>95%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: '95%', background: 'var(--primary)', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600' }}>
              <span style={{ color: 'var(--text-muted)' }}>Space Suitability</span>
              <span>88%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: '88%', background: 'var(--primary)', borderRadius: '3px' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600' }}>
              <span style={{ color: 'var(--text-muted)' }}>Care Maintenance Compatibility</span>
              <span>90%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: '90%', background: 'var(--accent)', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertCircle size={16} style={{ color: 'var(--primary)', marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>AI Care Suggestion</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '4px' }}>
              Since you selected {aiPreferences.housing} and {aiPreferences.activityLevel} activity, {matchedPet.name} matches perfectly. However, because you are away for work, we recommend setting up automated feeders or booking a midday dog walker.
            </p>
          </div>
        </div>

        <button 
          onClick={() => { setSelectedPetId(matchedPet.id); setActiveScreen('PetDetails'); }}
          className="btn-primary" 
          style={{ height: '48px', marginTop: '10px' }}
        >
          Proceed to Pet Details
        </button>
      </div>
    );
  }

  return null;
}
