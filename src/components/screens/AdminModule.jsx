import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, Users, Layers, Award, Sparkles, Check, X, BarChart2, CheckCircle, Eye } from 'lucide-react';

export default function AdminModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    setPets,
    updatePetStatus,
    notifications,
    setNotifications,
    setSelectedPetId
  } = useContext(AppContext);

  // States
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Approvals, Users

  // Pending listings dynamic list
  const pendingListings = pets.filter(p => p.status === 'Pending');

  const handleApproveListing = async (listingId, name) => {
    const success = await updatePetStatus(listingId, 'Available');
    
    if (success) {
      // Push new notification
      setNotifications(prev => [
        {
          id: `notif-admin-${Date.now()}`,
          title: 'Listing Approved',
          body: `Your listing for ${name} has been verified and published successfully.`,
          time: 'Just Now',
          read: false
        },
        ...prev
      ]);
      alert(`Listing for "${name}" approved successfully! Notification sent to owner.`);
    }
  };

  const handleDeclineListing = async (listingId, name) => {
    const success = await updatePetStatus(listingId, 'Rejected');
    
    if (success) {
      setNotifications(prev => [
        {
          id: `notif-admin-${Date.now()}`,
          title: 'Listing Rejected',
          body: `Your listing for ${name} was declined. Please review our community guidelines.`,
          time: 'Just Now',
          read: false
        },
        ...prev
      ]);
      alert(`Listing for "${name}" has been declined.`);
    }
  };

  if (activeScreen !== 'AdminDashboard') return null;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield style={{ color: 'var(--accent)' }} size={22} />
          <span>Admin Controls</span>
        </h1>
        <button onClick={() => setActiveScreen('HomeDashboard')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>Exit Panel</button>
      </div>

      {/* Tabs segment */}
      <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
        {['Overview', 'Approvals', 'System Users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem', fontWeight: 'bold',
              background: activeTab === tab ? 'var(--bg-card)' : 'none',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          {/* Grid stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px', borderRadius: 'var(--radius-lg)' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold', marginTop: '6px' }}>TOTAL ADOPTERS</span>
              <strong style={{ fontSize: '1.25rem', display: 'block', marginTop: '2px' }}>1,480</strong>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '14px', borderRadius: 'var(--radius-lg)' }}>
              <Layers size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 'bold', marginTop: '6px' }}>ACTIVE PETS</span>
              <strong style={{ fontSize: '1.25rem', display: 'block', marginTop: '2px' }}>{pets.length} listings</strong>
            </div>
          </div>

          {/* SVG Vector Analytics chart */}
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
              <span>Listings Trend (Last 6 Months)</span>
            </h3>
            
            <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', padding: '10px 0' }}>
              {/* Bar 1 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ height: '30px', width: '100%', background: 'var(--primary-light)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: '100%', background: 'var(--primary)', bottom: 0, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Jan</span>
              </div>
              {/* Bar 2 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ height: '45px', width: '100%', background: 'var(--primary-light)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: '100%', background: 'var(--primary)', bottom: 0, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Feb</span>
              </div>
              {/* Bar 3 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ height: '70px', width: '100%', background: 'var(--primary-light)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: '100%', background: 'var(--primary)', bottom: 0, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Mar</span>
              </div>
              {/* Bar 4 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ height: '55px', width: '100%', background: 'var(--primary-light)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: '100%', background: 'var(--primary)', bottom: 0, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Apr</span>
              </div>
              {/* Bar 5 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ height: '90px', width: '100%', background: 'var(--primary-light)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: '100%', background: 'var(--primary)', bottom: 0, borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>May</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Approvals */}
      {activeTab === 'Approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Pending Listings approvals ({pendingListings.length})</h3>
          
          {pendingListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent)', margin: '0 auto 8px' }} />
              <p style={{ fontWeight: 'bold' }}>Approvals queue clean!</p>
              <p style={{ fontSize: '0.72rem', marginTop: '2px' }}>All pet listings have been processed by system logs.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingListings.map(lst => (
                <div 
                  key={lst.id}
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
                  <img src={lst.images?.[0] || 'https://via.placeholder.com/150'} alt={lst.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{lst.name} ({lst.breed})</h4>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Breeder: {lst.owner?.name || 'Unknown'}</span>
                    <span style={{ fontSize: '0.62rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '1px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>{lst.category}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      onClick={() => { setSelectedPetId(lst.id); setActiveScreen('PetDetails'); }}
                      style={{ background: 'var(--bg-input)', color: 'var(--text-main)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => handleApproveListing(lst.id, lst.name)}
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeclineListing(lst.id, lst.name)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'red', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Users List */}
      {activeTab === 'System Users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
          <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>User Moderation Controls</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', display: 'block' }}>Sarah Jenkins</strong>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>sarah.j@petmail.com • Seller</span>
              </div>
              <button 
                onClick={() => alert('Sarah Jenkins status updated to Suspended.')}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'red', fontSize: '0.72rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '4px' }}
              >
                Suspend
              </button>
            </div>

            <div style={{ display: 'flex', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.82rem', display: 'block' }}>David Miller</strong>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>david.m@petmail.com • Seller</span>
              </div>
              <button 
                onClick={() => alert('David Miller status updated to Suspended.')}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'red', fontSize: '0.72rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '4px' }}
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
