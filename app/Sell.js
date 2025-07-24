import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

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
  const [form, setForm] = useState({
    category: '',
    title: '',
    region: '',
    description: '',
    name: '',
    phone: '',
    deliveryServices: '',
    image: null,
    upload: null,
  });

  const [errors, setErrors] = useState({});
  const [submittedItems, setSubmittedItems] = useState([]);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async (field = 'image') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, [field]: result.assets[0].uri });
    }
  };

  const removeImage = (field) => {
    setForm({ ...form, [field]: null });
  };

  const handleSubmit = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    const newItem = { ...form };
    const updatedItems = [...submittedItems, newItem];
    setSubmittedItems(updatedItems);

    navigation.navigate('ProductList', { items: updatedItems });

    setForm({
      category: '',
      title: '',
      region: '',
      description: '',
      name: '',
      phone: '',
      deliveryServices: '',
      image: null,
      upload: null,
    });

    setErrors({});
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
          <RNPickerSelect
            onValueChange={(value) => setForm({ ...form, category: value })}
            items={categories}
            value={form.category}
            placeholder={{ label: 'Select Category', value: null }}
            style={pickerSelectStyles}
          />
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

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
          <Text style={styles.emptyText}>Add Image</Text>
          {form.image ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: form.image }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImage('image')}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage('image')}>
              <Text>Select Image</Text>
            </TouchableOpacity>
          )}

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

          {/* Upload Picker */}
          <Text style={styles.emptyText}>Upload</Text>
          {form.upload ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: form.upload }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImage('upload')}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={() => handlePickImage('upload')}>
              <Text>Select File</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
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
