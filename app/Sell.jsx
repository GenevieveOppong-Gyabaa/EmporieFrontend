import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { BACKEND_URL } from '../constants/config';
import { useUser } from '../context/userContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const regions = [
  'Greater Accra', 'Ashanti', 'Eastern', 'Western', 'Central',
  'Volta', 'Northern', 'Upper East', 'Upper West', 'Savannah',
  'Bono', 'Bono East', 'North East', 'Oti', 'Ahafo', 'Western North',
].map(region => ({ label: region, value: region }));

// Fallback categories if backend is not available
const fallbackCategories = [
  { label: 'Electronics', value: '1' },
  { label: 'Fashion', value: '2' },
  { label: 'Home', value: '3' },
  { label: 'Beauty', value: '4' },
  { label: 'Health', value: '5' },
  { label: 'Toys', value: '6' },
  { label: 'Groceries', value: '7' },
  { label: 'Books', value: '8' },
  { label: 'Sports', value: '9' },
  { label: 'Other', value: '10' },
];

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
    images: [], 
    price: '',
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);

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
      console.log('Fetching categories from:', `${BACKEND_URL}/categories`);
      const res = await fetch(`${BACKEND_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      console.log('Fetched categories:', data);
      
      // Map backend categories to RNPickerSelect format
      const mappedCategories = data.map(cat => ({
        label: cat.name,
        value: cat.id.toString() // Convert to string for RNPickerSelect
      }));
      console.log('Mapped categories for dropdown:', mappedCategories);
      setCategories(mappedCategories);
    } catch (err) {
      console.log('Error fetching categories:', err);
      console.log('Using fallback categories');
      setCategories(fallbackCategories);
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
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
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

      if (form.images.some(img => img === asset.uri)) {
        setImageError('This image is already added.');
        return;
      }
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

      const payload = {
        name: form.title,
        description: form.description,
        userId: user.id,
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        imageUrls: [],
        tags: [],
      };
     // products without images
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
      // products with images
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={{ width: '90%', alignSelf: 'center' }}>
            <Text style={styles.emptyText}>Category</Text>
            <TouchableOpacity 
              style={[styles.input, { marginBottom: 10 }]} 
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={{ color: form.categoryId ? '#000' : '#888' }}>
                {form.categoryId ? categories.find(c => c.value === form.categoryId)?.label || 'Select Category' : 'Select Category'}
              </Text>
            </TouchableOpacity>
            {showCategoryDropdown && (
              <View style={{
                position: 'absolute',
                top: 120,
                left: 20,
                right: 20,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                zIndex: 1000,
                maxHeight: 300,
              }}>
                <ScrollView style={{ maxHeight: 280 }}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={{ 
                        padding: 15, 
                        borderBottomWidth: 1, 
                        borderBottomColor: '#eee',
                        backgroundColor: form.categoryId === category.value ? '#f0f0f0' : '#fff'
                      }}
                      onPress={() => {
                        console.log('Selected category:', category.value);
                        setForm({ ...form, categoryId: category.value });
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={{ 
                        fontSize: 16,
                        color: form.categoryId === category.value ? '#361696' : '#000',
                        fontWeight: form.categoryId === category.value ? '600' : '400'
                      }}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId}</Text>}

      
            {renderInput('Title', 'title')}

     
            <Text style={styles.emptyText}>Region</Text>
            <TouchableOpacity 
              style={[styles.input, { marginBottom: 10 }]} 
              onPress={() => setShowRegionDropdown(!showRegionDropdown)}
            >
              <Text style={{ color: form.region ? '#000' : '#888' }}>
                {form.region || 'Select Region'}
              </Text>
            </TouchableOpacity>
            {showRegionDropdown && (
              <View style={{
                position: 'absolute',
                top: 280,
                left: 20,
                right: 20,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                zIndex: 1000,
                maxHeight: 300,
              }}>
                <ScrollView style={{ maxHeight: 280 }}>
                  {regions.map((region) => (
                    <TouchableOpacity
                      key={region.value}
                      style={{ 
                        padding: 15, 
                        borderBottomWidth: 1, 
                        borderBottomColor: '#eee',
                        backgroundColor: form.region === region.value ? '#f0f0f0' : '#fff'
                      }}
                      onPress={() => {
                        console.log('Selected region:', region.value);
                        setForm({ ...form, region: region.value });
                        setShowRegionDropdown(false);
                      }}
                    >
                      <Text style={{ 
                        fontSize: 16,
                        color: form.region === region.value ? '#361696' : '#000',
                        fontWeight: form.region === region.value ? '600' : '400'
                      }}>
                        {region.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            
            {renderInput('Name', 'name')}
            {renderInput('Phone number', 'phone', 'phone-pad')}
            {renderInput('Price (GHS)', 'price', 'numeric')}

            <Text style={styles.emptyText}>Delivery Services</Text>
            <TouchableOpacity 
              style={[styles.input, { marginBottom: 10 }]} 
              onPress={() => setShowDeliveryDropdown(!showDeliveryDropdown)}
            >
              <Text style={{ color: form.deliveryServices ? '#000' : '#888' }}>
                {form.deliveryServices || 'Select Delivery Option'}
              </Text>
            </TouchableOpacity>
            {showDeliveryDropdown && (
              <View style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                marginBottom: 10,
                maxHeight: 200,
              }}>
                <ScrollView style={{ maxHeight: 180 }}>
                  {deliveryServices.map((service) => (
                    <TouchableOpacity
                      key={service.value}
                      style={{ 
                        padding: 15, 
                        borderBottomWidth: 1, 
                        borderBottomColor: '#eee',
                        backgroundColor: form.deliveryServices === service.value ? '#f0f0f0' : '#fff'
                      }}
                      onPress={() => {
                        console.log('Selected delivery service:', service.value);
                        setForm({ ...form, deliveryServices: service.value });
                        setShowDeliveryDropdown(false);
                      }}
                    >
                      <Text style={{ 
                        fontSize: 16,
                        color: form.deliveryServices === service.value ? '#361696' : '#000',
                        fontWeight: form.deliveryServices === service.value ? '600' : '400'
                      }}>
                        {service.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
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

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
