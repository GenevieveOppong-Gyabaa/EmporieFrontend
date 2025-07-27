import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { BACKEND_URL } from '../constants/config';
import { useUser } from '../context/userContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const regions = [
  'Greater Accra', 'Ashanti', 'Eastern', 'Western', 'Central',
  'Volta', 'Northern', 'Upper East', 'Upper West', 'Savannah',
  'Bono', 'Bono East', 'North East', 'Oti', 'Ahafo', 'Western North',
].map(region => ({ label: region, value: region }));

const categories = [
  'Electronics', 'Fashion', 'Home', 'Beauty', 'Health',
  'Toys', 'Groceries', 'Books', 'Sports', 'Other',
].map(cat => ({ label: cat, value: cat }));

const deliveryServices = [
  { label: 'Doorstep Delivery', value: 'doorstep' },
];

const SellProductScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    categoryId: '',
    title: '',
    region: '',
    description: '',
    name: '',
    phone: '',
    deliveryServices: '',
    images: [], // now an array
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  // Removed: const [isBecomingSeller, setIsBecomingSeller] = useState(false);

  const MAX_IMAGES = 3;
  const MAX_IMAGE_SIZE_MB = 2;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.map(cat => ({ label: cat.name, value: cat.id })));
    } catch (err) {
      Alert.alert('Error', 'Could not load categories');
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.categoryId) newErrors.categoryId = 'Category is required';
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.region) newErrors.region = 'Region is required';
    if (!form.deliveryServices) newErrors.deliveryServices = 'Delivery service is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    if (form.images.length >= MAX_IMAGES) {
      setImageError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }
    setImageError('');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      // Check for duplicate
      if (form.images.some(img => img === asset.uri)) {
        setImageError('This image is already added.');
        return;
      }
      // Check file size (asset.fileSize is not always available, so fetch it if needed)
      let fileSize = asset.fileSize;
      if (fileSize == null && asset.uri.startsWith('file://')) {
        try {
          const fileInfo = await fetch(asset.uri);
          const blob = await fileInfo.blob();
          fileSize = blob.size;
        } catch (e) {
          fileSize = null;
        }
      }
      if (fileSize != null && fileSize > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setImageError(`Each image must be less than ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }
      setForm({ ...form, images: [...form.images, asset.uri] });
    }
  };

  const removeImage = (uri) => {
    setForm({ ...form, images: form.images.filter(img => img !== uri) });
    setImageError('');
  };

  // Removed: Helper to check if user is a seller (assume user.role is available after login/become-seller)
  // Removed: const isSeller = user && user.role === 'SELLER';

  // Removed: becomeSeller

  const handleSubmit = async () => {
    console.log('user context:', user);
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    if (form.images.length === 0) {
      setImageError('Please add at least one image.');
      return;
    }
    setLoading(true);
    try {
      if (!user || !user.token || !user.id) throw new Error('User not authenticated');
      // No need to check or become seller, just proceed with product creation
      const payload = {
        name: form.title,
        description: form.description,
        userId: user.id,
        categoryId: form.categoryId,
        imageUrls: [],
        tags: [],
      };
      // Step 1: Create product (no image)
      const createRes = await fetch(`${BACKEND_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!createRes.ok) {
        const errorData = await createRes.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to create product');
      }
      const createdProduct = await createRes.json();
      // Step 2: Upload images if present
      if (form.images.length > 0) {
        const imageData = new FormData();
        form.images.forEach((img, idx) => {
          imageData.append('images', {
            uri: img,
            name: `product-image-${idx}.jpg`,
            type: 'image/jpeg',
          });
        });
        const uploadRes = await fetch(`${BACKEND_URL}/products/${createdProduct.id}/upload-images?userId=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`,
          },
          body: imageData,
        });
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || 'Failed to upload image');
        }
      }
      Alert.alert('Success', 'Product submitted!');
      setForm({
        categoryId: '',
        title: '',
        region: '',
        description: '',
        name: '',
        phone: '',
        deliveryServices: '',
        images: [],
      });
      setErrors({});
      setImageError('');
      router.replace('/ProductList');
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, key, keyboardType = 'default') => (
    <View key={key}>
      <Text style={styles.emptyText}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] && { borderColor: 'red' }]}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={form[key]}
        onChangeText={(text) => {
          setForm({ ...form, [key]: text });
          setErrors({ ...errors, [key]: null });
        }}
        keyboardType={keyboardType}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#361696', '#5c1aff', '#8f00ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Sell a Product</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ width: '90%', alignSelf: 'center' }}>
          {/* Category Picker */}
          <Text style={styles.emptyText}>Category</Text>
          {categoriesLoading ? (
            <Text>Loading categories...</Text>
          ) : (
            <RNPickerSelect
              onValueChange={(value) => setForm({ ...form, categoryId: value })}
              items={categories}
              value={form.categoryId}
              placeholder={{ label: 'Select Category', value: null }}
              style={pickerSelectStyles}
            />
          )}
          {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId}</Text>}

          {/* Title */}
          {renderInput('Title', 'title')}

          {/* Region Picker */}
          <Text style={styles.emptyText}>Region</Text>
          <RNPickerSelect
            onValueChange={(value) => setForm({ ...form, region: value })}
            items={regions}
            value={form.region}
            placeholder={{ label: 'Select Region', value: null }}
            style={pickerSelectStyles}
          />

          {/* Name, Phone */}
          {renderInput('Name', 'name')}
          {renderInput('Phone number', 'phone', 'phone-pad')}

          {/* Delivery Service */}
          <Text style={styles.emptyText}>Delivery Services</Text>
          <RNPickerSelect
            onValueChange={(value) => setForm({ ...form, deliveryServices: value })}
            items={deliveryServices}
            value={form.deliveryServices}
            placeholder={{ label: 'Select Delivery Option', value: null }}
            style={pickerSelectStyles}
          />

          {/* Image Picker */}
          <Text style={styles.emptyText}>Add Images (up to 3, max 2MB each)</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {form.images.map((img, idx) => (
              <View key={img} style={{ alignItems: 'center', marginRight: 10 }}>
                <Image source={{ uri: img }} style={styles.image} />
                <TouchableOpacity onPress={() => removeImage(img)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            {form.images.length < MAX_IMAGES && (
              <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                <Text>Add Image</Text>
              </TouchableOpacity>
            )}
          </View>
          {imageError ? <Text style={{ color: 'red', marginBottom: 8 }}>{imageError}</Text> : null}

          {/* Description */}
          <Text style={styles.emptyText}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }, errors.description && { borderColor: 'red' }]}
            multiline
            placeholder="Enter description"
            value={form.description}
            onChangeText={(text) => {
              setForm({ ...form, description: text });
              setErrors({ ...errors, description: null });
            }}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SellProductScreen;

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    color: '#000',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    color: '#000',
    marginBottom: 10,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    paddingTop: (StatusBar.currentHeight || 44) + 80,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  removeText: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: '#361696',
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
});
