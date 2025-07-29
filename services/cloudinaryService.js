import axios from 'axios';

export const uploadImagesToCloudinary = async (imageUris) => {
  const uploadPromises = imageUris.map(async (imageUri) => {
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // You may want to detect the actual mime type
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'Emporie');
    data.append('cloud_name', 'dfrq2xnn2');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dfrq2xnn2/image/upload',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  });

  return Promise.all(uploadPromises);
};