import { supabase } from '../config/supabase.js';

export const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const uid = userId || req.user.id;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getTransactions error:', error.message);
      return res.status(500).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const { userId, checkoutDetails } = req.body;
    const uid = userId || req.user.id;

    if (!checkoutDetails || !checkoutDetails.amount) {
      return res.status(400).json({ message: 'checkoutDetails with amount is required.' });
    }

    // Insert a transaction record
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: uid,
        pet_id: checkoutDetails.petId || null,
        pet_name: checkoutDetails.petName || '',
        amount: checkoutDetails.amount,
        payment_method: checkoutDetails.paymentMethod || 'wallet',
        status: 'success',
        type: 'debit'
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Deduct from wallet if paying by wallet
    if (checkoutDetails.paymentMethod === 'wallet') {
      await supabase.rpc('deduct_wallet', { uid, amount: checkoutDetails.amount }).catch(() => {
        // If RPC doesn't exist, manually update
        supabase
          .from('users')
          .update({ wallet: supabase.raw(`wallet - ${checkoutDetails.amount}`) })
          .eq('id', uid);
      });
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const addMoneyToWallet = async (req, res, next) => {
  try {
    const { userId, amount } = req.body;
    const uid = userId || req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'A positive amount is required.' });
    }

    // Get current wallet balance
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('wallet')
      .eq('id', uid)
      .single();

    if (fetchError) {
      return res.status(500).json({ message: fetchError.message });
    }

    const newBalance = (parseFloat(user.wallet) || 0) + parseFloat(amount);

    // Update wallet
    const { error: updateError } = await supabase
      .from('users')
      .update({ wallet: newBalance })
      .eq('id', uid);

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    // Record the transaction
    await supabase
      .from('transactions')
      .insert([{
        user_id: uid,
        amount: parseFloat(amount),
        payment_method: 'wallet_topup',
        status: 'success',
        type: 'credit',
        pet_name: 'Wallet Top-Up'
      }]);

    res.status(201).json({ balance: newBalance });
  } catch (error) {
    next(error);
  }
};

export const getWalletBalance = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const uid = userId || req.user.id;

    const { data, error } = await supabase
      .from('users')
      .select('wallet')
      .eq('id', uid)
      .single();

    if (error) {
      return res.json({ balance: 0 });
    }

    res.json({ balance: parseFloat(data.wallet) || 0 });
  } catch (error) {
    next(error);
  }
};
