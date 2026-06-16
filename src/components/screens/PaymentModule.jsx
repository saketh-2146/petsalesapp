import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, CreditCard, Download, Plus, Wallet, TrendingUp } from 'lucide-react';

export default function PaymentModule() {
  const { 
    activeScreen, 
    setActiveScreen, 
    pets, 
    selectedPetId, 
    processPayment, 
    paymentHistory,
    walletBalance,
    addMoneyToWallet
  } = useContext(AppContext);

  // States
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  // Card Inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  const [checkoutPet, setCheckoutPet] = useState(() => pets.find(p => p.id === selectedPetId) || pets[0]);
  const [paymentTx, setPaymentTx] = useState(null);

  const deliveryFee = 500;
  const originalPrice = checkoutPet?.price || 15000;
  const discountAmount = promoDiscount;
  const totalDue = originalPrice + deliveryFee - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'PAWS20') {
      setPromoDiscount(1000);
      alert('Promo code applied successfully! Saved ₹1,000.');
    } else {
      alert('Invalid promo code. Try "PAWS20" for ₹1,000 off.');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 15 || !cardExpiry || cardCvc.length < 3) {
      alert('Please fill out all payment credentials correctly.');
      return;
    }

    const tx = processPayment({
      petId: checkoutPet.id,
      petName: checkoutPet.name,
      total: totalDue,
      paymentMethod: `Credit Card (**** ${cardNumber.slice(-4)})`
    });

    setPaymentTx(tx);
    setActiveScreen('PaymentSuccess');
  };

  // Pre-seed default transaction history if none
  const defaultHistory = paymentHistory.length > 0 ? paymentHistory : [
    { id: 'tx-229108', date: '2026-04-12', petName: 'Bella', amount: 25500, paymentMethod: 'PayPal', status: 'Success' },
    { id: 'tx-901822', date: '2026-05-18', petName: 'Luna', amount: 12500, paymentMethod: 'Credit Card **** 8821', status: 'Success' }
  ];

  // Screen 43: Checkout Screen
  if (activeScreen === 'CheckoutScreen') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Checkout</h1>

        {/* Order Summary */}
        <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <img src={checkoutPet?.images?.[0]} alt={checkoutPet?.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{checkoutPet?.name}</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{checkoutPet?.breed} • {checkoutPet?.gender}</p>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)', display: 'block', marginTop: '2px' }}>
              {originalPrice === 0 ? 'Free' : `₹${originalPrice.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        {/* Promo Code box */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Promo Code (use PAWS20)" 
            value={promoCode} 
            onChange={(e) => setPromoCode(e.target.value)}
            style={{ flex: 1, height: '40px', padding: '0 12px' }}
          />
          <button 
            type="button" 
            onClick={handleApplyPromo}
            className="btn-secondary" 
            style={{ padding: '0 16px', height: '40px', fontSize: '0.8rem' }}
          >
            Apply
          </button>
        </div>

        {/* Totals panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
            <span>₹{originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Courier Delivery:</span>
            <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'green', fontWeight: '600' }}>
              <span>Promo Discount:</span>
              <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span style={{ color: 'var(--primary)' }}>₹{totalDue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button 
          onClick={() => setActiveScreen('PaymentGateway')}
          className="btn-primary" 
          style={{ height: '48px', marginTop: 'auto' }}
        >
          Proceed to Payment
        </button>
      </div>
    );
  }

  // Screen 44: Payment Gateway
  if (activeScreen === 'PaymentGateway') {
    const [payTab, setPayTab] = useState('card');
    const [selectedUpiApp, setSelectedUpiApp] = useState('');
    const [upiId, setUpiId] = useState('');
    const [upiLoading, setUpiLoading] = useState(false);

    const upiApps = [
      { name: 'Google Pay',  emoji: '🟢', hint: 'alexrivera@oksbi' },
      { name: 'PhonePe',     emoji: '🟣', hint: 'alexrivera@ybl' },
      { name: 'Paytm',       emoji: '🔵', hint: '9876543210@paytm' },
      { name: 'BHIM UPI',    emoji: '🟠', hint: 'alexrivera@upi' },
    ];

    const handleUpiSubmit = () => {
      if (!selectedUpiApp && !upiId.trim()) {
        alert('Please select a UPI app or enter your UPI ID.');
        return;
      }
      setUpiLoading(true);
      setTimeout(() => {
        const tx = processPayment({
          petId: checkoutPet.id,
          petName: checkoutPet.name,
          total: totalDue,
          paymentMethod: upiId.trim() ? `UPI (${upiId.trim()})` : `${selectedUpiApp} (UPI)`
        });
        setPaymentTx(tx);
        setActiveScreen('PaymentSuccess');
      }, 1800);
    };

    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Secure Payment</h1>

        {/* Amount Banner */}
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', padding: '14px 18px', borderRadius: '14px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.62rem', opacity: 0.8, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount Due</span>
            <strong style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>₹{totalDue.toLocaleString('en-IN')}</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 'bold' }}>🔒 Escrow</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-input)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          {[{ id: 'card', label: '💳 Debit/Credit Card' }, { id: 'upi', label: '📱 UPI Apps' }].map(t => (
            <button key={t.id} onClick={() => setPayTab(t.id)}
              style={{ padding: '9px', borderRadius: '8px', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                background: payTab === t.id ? 'var(--primary)' : 'transparent',
                color: payTab === t.id ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Card Panel ── */}
        {payTab === 'card' && (
          <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>CARDHOLDER NAME</span>
              <input type="text" placeholder="e.g. Alex Rivera" value={cardName} onChange={e => setCardName(e.target.value)} required />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>CARD NUMBER</span>
              <div style={{ position: 'relative' }}>
                <CreditCard size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g,'').slice(0,16))}
                  style={{ paddingLeft: '38px', letterSpacing: '2px' }} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>EXPIRY</span>
                <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value.slice(0,5))} required />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>CVC</span>
                <input type="password" placeholder="•••" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g,'').slice(0,4))} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Accepted:</span>
              {['VISA','MC','RuPay','Amex'].map(c => (
                <span key={c} style={{ fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 7px', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--bg-card)' }}>{c}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
              256-bit SSL encrypted · RBI compliant escrow protection
            </div>
            <button type="submit" className="btn-primary" style={{ height: '48px', fontSize: '0.9rem', fontWeight: 800 }}>
              Pay ₹{totalDue.toLocaleString('en-IN')} Securely
            </button>
          </form>
        )}

        {/* ── UPI Panel ── */}
        {payTab === 'upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Choose UPI App</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {upiApps.map(app => (
                <button key={app.name} onClick={() => { setSelectedUpiApp(app.name); setUpiId(''); }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 10px',
                    background: selectedUpiApp === app.name ? 'var(--primary-light)' : 'var(--bg-card)',
                    border: `2px solid ${selectedUpiApp === app.name ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  <span style={{ fontSize: '1.8rem' }}>{app.emoji}</span>
                  <span>{app.name}</span>
                </button>
              ))}
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>OR ENTER UPI ID</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>@</span>
                <input type="text" placeholder={selectedUpiApp ? upiApps.find(a => a.name === selectedUpiApp)?.hint : 'yourname@upi'}
                  value={upiId} onChange={e => { setUpiId(e.target.value); setSelectedUpiApp(''); }}
                  style={{ paddingLeft: '30px' }} />
              </div>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                e.g. alexrivera@oksbi · alexrivera@ybl · 9876543210@paytm
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-input)', padding: '9px 12px', borderRadius: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
              NPCI certified · Instant transfer · No extra charges
            </div>

            <button onClick={handleUpiSubmit} disabled={upiLoading}
              style={{ height: '48px', fontSize: '0.9rem', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', cursor: upiLoading ? 'not-allowed' : 'pointer', opacity: upiLoading ? 0.7 : 1 }}>
              {upiLoading ? '⏳ Waiting for UPI Approval…' : `Continue with UPI — ₹${totalDue.toLocaleString('en-IN')}`}
            </button>
          </div>
        )}
      </div>
    );
  }


  // Screen 45: Payment Success
  if (activeScreen === 'PaymentSuccess') {
    return (
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '12px' }} className="animate-fade-in">
        <div style={{
          width: '72px', height: '72px',
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulseRing 1.5s infinite',
          marginBottom: '10px'
        }}>
          <Check size={36} strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Payment Completed!</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Security escrow hold verification has succeeded.</p>
        
        {paymentTx && (
          <div style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>Order Reference: <strong style={{ color: 'var(--text-main)' }}>{paymentTx.id}</strong></span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '20px' }}>
          <button onClick={() => setActiveScreen('PaymentHistory')} className="btn-primary" style={{ height: '44px' }}>View Payment History</button>
          <button onClick={() => setActiveScreen('HomeDashboard')} className="btn-secondary" style={{ height: '44px' }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // Screen 46: Payment History
  if (activeScreen === 'PaymentHistory') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Transaction History</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {defaultHistory.map(tx => (
            <div 
              key={tx.id}
              style={{
                padding: '12px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Purchase: {tx.petName}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>ID: {tx.id} • {tx.date}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Paid via: {tx.paymentMethod}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', display: 'block' }}>₹{tx.amount.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 'bold', display: 'block', marginTop: '2px' }}>{tx.status}</span>
              </div>
            </div>
          ))}

          <button 
            onClick={() => alert('PDF Invoice summary compiled! (Simulated download)')}
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '44px', marginTop: '10px' }}
          >
            <Download size={14} />
            <span>Export Transaction Summaries</span>
          </button>
        </div>
      </div>
    );
  }

  // Screen 47: Wallet
  if (activeScreen === 'WalletScreen') {
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>My Wallet</h1>

        {/* Wallet Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          padding: '22px',
          borderRadius: '20px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '30px', width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.65rem', opacity: 0.75, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginTop: '6px', letterSpacing: '-1px' }}>₹{walletBalance.toLocaleString('en-IN')}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>•••• •••• •••• 4242</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Alex Rivera</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={() => setActiveScreen('AddMoneyScreen')}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white', border: 'none', padding: '14px',
              borderRadius: 'var(--radius-lg)', fontWeight: '700',
              fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
            }}
          >
            <Plus size={22} />
            <span>Add Money</span>
          </button>
          <button
            onClick={() => setActiveScreen('PaymentHistory')}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-main)', padding: '14px',
              borderRadius: 'var(--radius-lg)', fontWeight: '700',
              fontSize: '0.82rem', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
            }}
          >
            <TrendingUp size={22} />
            <span>Transactions</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Recent Activity</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: '💳', label: 'Money Added', date: 'June 9, 2026', amount: '+₹5,000', color: '#16a34a', bg: '#dcfce7' },
              { icon: '🐶', label: 'Pet Purchase - Milo', date: 'June 5, 2026', amount: '-₹25,500', color: '#dc2626', bg: '#fee2e2' },
              { icon: '💳', label: 'Money Added', date: 'June 1, 2026', amount: '+₹30,000', color: '#16a34a', bg: '#dcfce7' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{item.icon}</div>
                  <div>
                    <strong style={{ fontSize: '0.78rem', display: 'block' }}>{item.label}</strong>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                </div>
                <strong style={{ color: item.color, fontSize: '0.85rem' }}>{item.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Screen 48: Add Money
  if (activeScreen === 'AddMoneyScreen') {
    const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];
    return (
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.25rem' }}>Add Money</h1>

        {/* Balance Display */}
        <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Balance</span>
          <strong style={{ fontSize: '1rem', color: '#7c3aed' }}>₹{walletBalance.toLocaleString('en-IN')}</strong>
        </div>

        {/* Amount Input */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Enter Amount (₹)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>₹</span>
            <input
              type="number"
              placeholder="0"
              id="add-money-amount-react"
              min="100"
              max="100000"
              step="100"
              style={{ paddingLeft: '32px', fontSize: '1.1rem', fontWeight: 'bold' }}
            />
          </div>
        </div>

        {/* Quick Amounts */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Quick Add</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {quickAmounts.map(amt => (
              <button
                key={amt}
                onClick={() => { const el = document.getElementById('add-money-amount-react'); if(el) el.value = amt; }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '10px 6px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-main)' }}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Payment Method</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 'upi', icon: '📱', label: 'UPI / GPay / PhonePe', sub: 'Instant transfer', selected: true },
              { value: 'netbanking', icon: '🏦', label: 'Net Banking', sub: 'All major Indian banks', selected: false },
              { value: 'card', icon: '💳', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay', selected: false }
            ].map((method, i) => (
              <label key={i} style={{ background: 'var(--bg-card)', border: `2px solid ${i === 0 ? '#7c3aed' : 'var(--border)'}`, padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="radio" name="pay-method-react" defaultChecked={method.selected} style={{ accentColor: '#7c3aed' }} />
                <span style={{ fontSize: '1.2rem' }}>{method.icon}</span>
                <div>
                  <strong style={{ fontSize: '0.8rem', display: 'block' }}>{method.label}</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{method.sub}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('add-money-amount-react');
            const amount = parseFloat(el?.value);
            if (!amount || amount < 100) { alert('Please enter a valid amount (minimum ₹100)'); return; }
            if (amount > 100000) { alert('Maximum limit is ₹1,00,000'); return; }
            addMoneyToWallet(amount);
            alert(`✅ ₹${amount.toLocaleString('en-IN')} added successfully!\nNew Balance: ₹${(walletBalance + amount).toLocaleString('en-IN')}`);
            setActiveScreen('WalletScreen');
          }}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white', border: 'none', padding: '14px',
            borderRadius: 'var(--radius-lg)', fontWeight: '800',
            fontSize: '0.9rem', cursor: 'pointer', marginTop: '4px'
          }}
        >
          Proceed to Add Money
        </button>
      </div>
    );
  }

  return null;
}
