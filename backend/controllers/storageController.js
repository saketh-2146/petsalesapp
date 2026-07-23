import { supabase } from '../config/supabase.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase storage 'pet-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Image upload error:', uploadError.message);
      return res.status(500).json({ message: `Upload failed: ${uploadError.message}` });
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('pet-images')
      .getPublicUrl(fileName);

    res.status(201).json({ url: urlData.publicUrl });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: 'fileUrl is required.' });
    }

    // Extract the file path from the full URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/pet-images/<path>
    const bucketPath = fileUrl.split('/pet-images/')[1];
    if (!bucketPath) {
      return res.status(400).json({ message: 'Invalid file URL format.' });
    }

    const { error } = await supabase.storage
      .from('pet-images')
      .remove([bucketPath]);

    if (error) {
      console.error('Image delete error:', error.message);
      return res.status(500).json({ message: `Delete failed: ${error.message}` });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
