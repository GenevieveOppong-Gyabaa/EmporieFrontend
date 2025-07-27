
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';


/* ─────────────── Local assets ─────────────── */
//import Bags from '../../assets/images/bags.png';
import Art from '../../assets/images/Art.png'; //added arts
import Beauty from '../../assets/images/beauty.png';
import Books from '../../assets/images/Books.png';
import Electronics from '../../assets/images/electronics.png';
import Groceries from '../../assets/images/Groceries.png';
import Health from '../../assets/images/Health.png';
import HomeDecor from '../../assets/images/HomeandLiving.png';
import Item15 from '../../assets/images/Item 16.png';
import Item16 from '../../assets/images/Item 18.png';
import Item1 from '../../assets/images/Item1.png';
import Item10 from '../../assets/images/Item10.png';
import Item11 from '../../assets/images/Item11.png';
import Item12 from '../../assets/images/Item12.png';
import Item13 from '../../assets/images/Item13.png';
import Item14 from '../../assets/images/Item14.png';
import Item2 from '../../assets/images/Item2.png';
import Item3 from '../../assets/images/Item3.png';
import Item4 from '../../assets/images/Item4.png';
import Item5 from '../../assets/images/Item5.png';
import Item6 from '../../assets/images/Item6.png';
import Item7 from '../../assets/images/Item7.png';
import Item8 from '../../assets/images/Item8.png';
import Item9 from '../../assets/images/Item9.png';
import MenOfficial from '../../assets/images/MenWear.png';
import discoverImg from '../../assets/images/partygift.png';
import Sports from '../../assets/images/Sport.png';
import Toys from '../../assets/images/Toys.png';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ─────────────── Static data ─────────────── */
const categories = [
  { id: '1', name: 'Beauty',              image: Beauty },
  { id: '2', name: "Fashion", image: MenOfficial },
  { id: '3', name: "Health",      image: Health },
  { id: '4', name: 'Toys',               image: Toys },
  { id: '5', name: 'Electronics',         image: Electronics },
  { id: '6', name: "Groceries",         image: Groceries },
  { id: '7', name: "Books",         image: Books },
  { id: '8', name: "Art",         image: Art },
  { id: '9', name: "Sports",         image: Sports },
  { id: '10', name: "Home Decor",         image: HomeDecor },
];

const productData = [
  { id: '1',  img: Item1,  title: "Mixed-beads for male and female",  price: 30.00, rating: 4.3 },
  { id: '2',  img: Item15,  title: "Mixed-beads for male and female",  price: 30.00, rating: 4.3 },
  { id: '3',  img: Item16,  title: "Lil's beads",  price: 20.00, rating: 4.3 },
  { id: '4',  img: Item2,  title: 'Scrunchy',  price: 10.00, rating: 4.7 },
  { id: '5',  img: Item3,  title: "Scrunchy",  price: 10.00, rating: 4.8 },
  { id: '6',  img: Item4,  title: "Peach-colored hair holder",  price: 10.00, rating: 4.2   },
  { id: '7',  img: Item5,  title: 'Trendy hair holder',                price: 10.00, rating: 4.5  },
  { id: '8',  img: Item6,  title: 'Black and white hair band',             price: 15.00, rating: 4.1  },
  { id: '9',  img: Item7,  title: 'Pink-inspired bonnet',              price: 50.00, rating: 4.6 },
  { id: '10',  img: Item8,  title: 'Plain black bonnet',                price: 50.00, rating: 4.0 },
  { id: '11',  img: Item9,  title: 'Trendy hair bonnet',             price: 50.00, rating: 4.4},
  { id: '12', img: Item10, title: 'Beautiful hair bands',              price: 15.00, rating: 4.9  },
  { id: '13', img: Item11, title: 'Hair bonnet',              price: 50.00, rating: 4.3  },
  { id: '14', img: Item12, title: 'Sweet honey',               price: 33.00, rating: 4.2  },
  { id: '15', img: Item13, title: 'Phone case',             price: 30.00, rating: 4.8  },
  { id: '16', img: Item14, title: "Luxurious lady's bag",              price: 500.00, rating: 4.0  },
];


export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

   const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setModalVisible(false);
  };
 
  return (
   <SafeAreaView style={[styles.container, { paddingTop: 0 }]}>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      {/*<StatusBar backgroundColor="#fff" style="dark" />*/}

      {/*<View style={styles.container}>*/}
      {/*<View style={styles.container}>*/}
      {/* ███ Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search for anything"
            placeholderTextColor="#888"
            style={{ flex: 1, fontSize: 15 }}
          />
        </View>
                 <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('Favorites')}>
           <Ionicons name="notifications-outline" size={22} color="#222" />
         </TouchableOpacity>
         <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('Profile')}>
           <Ionicons name="person-circle-outline" size={22} color="#222" />
         </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ███ Discover banner */}
        <View style={styles.discoverCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.discoverTitle}>
              You’re just one tap away from something special
            </Text>
            <TouchableOpacity style={styles.discoverBtn}>
              <Text style={styles.discoverBtnText}>Discover more items</Text>
            </TouchableOpacity>
          </View>
          <Image source={discoverImg} style={styles.discoverImg} />
        </View>

        {/* ███ Recommended Categories */}
        <Text style={styles.sectionTitle}>Recommended Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.slice(0, 4).map((c) => (
            <TouchableOpacity key={c.id} style={styles.categoryCard}>
              <Image source={c.image} style={styles.categoryImage} />
              <View style={styles.categoryLabelWrap}>
                <Text style={styles.categoryLabel}>{c.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* All categories btn */}
        <TouchableOpacity style={styles.allCategoriesBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.allCategoriesText}>All Categories</Text>
        </TouchableOpacity>

        {/* ███ Trending Picks */}
        <Text style={styles.sectionTitle}>Trending Picks</Text>
                 <FlatList
           data={productData}
           numColumns={2}
           columnWrapperStyle={{ justifyContent: 'space-between' }}
           keyExtractor={(item) => item.id}
           scrollEnabled={false}
           renderItem={({ item }) => (
             <ProductCard 
               {...item} 
               onPress={() => {
                 router.push({
                   pathname: '../Details',
                   params: { productId: item.id || '1' }
                 });
               }}
             />
           )}
         />
      </ScrollView>

      {/* ███ Category modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Category</Text>
            <ScrollView>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => handleCategorySelect(c.name)}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/*</View>*/}

    {/* Floating Grid Icon */}
         <TouchableOpacity 
     style={styles.floatingIcon}
     onPress={() => router.push("./Dashboard")}
     >
       <Ionicons name="grid" size={28} color="green" />
     </TouchableOpacity>
   {/*</View>*/}
  </SafeAreaView>

  );
}


/* ─────────────── Product card ─────────────── */
const ProductCard = ({ id, img, title, price, rating, onPress }) => (
  <TouchableOpacity 
    style={styles.productCard}
    onPress={onPress}
  >
    <Image source={img} style={styles.productImg} />

    <Text numberOfLines={1} style={styles.title}>
      {title}
    </Text>

    <View style={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < Math.round(rating) ? 'star' : 'star-outline'}
          size={12}
          color="#000"
        />
      ))}
      <Text style={styles.ratingText}>{Math.round(rating * 10) / 10}</Text>
    </View>

    <View style={styles.priceRow}>
      <Text style={styles.price}>GHC{price.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);


/* ─────────────── Styles ─────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5, // ✅ remove side padding
  },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconBtn: { marginLeft: 6, padding: 4 },

  /* discover banner */
  discoverCard: {
    flexDirection: 'row',
    backgroundColor: '#fbe9d0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  discoverTitle: { fontSize: 15, color: '#222', fontWeight: '500', marginBottom: 8 },
  discoverBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  discoverBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  discoverImg: { width: '50%', height: 110, resizeMode: 'cover', borderRadius: 12 },

  /* sections & categories */
  sectionTitle: {
    fontSize: 16,
    color: '#4B2994',
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 10,
  },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: SCREEN_WIDTH * 0.48, // ✅ responsive width
    aspectRatio: 1.1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryLabelWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  categoryLabel: { color: '#fff', fontWeight: '600', fontSize: 15 },

  allCategoriesBtn: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#361696',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#361696',
  },
  allCategoriesText: { fontSize: 16, color: '#fff', fontWeight: '500' },

  /* modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 14, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#4B2994' },
  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 16, color: '#333' },
  closeModalBtn: { marginTop: 16, backgroundColor: '#4B2994', padding: 12, borderRadius: 10, alignItems: 'center' },

  /* product grid */
  productCard: {
    width: SCREEN_WIDTH * 0.48, // ✅ responsive width
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    elevation: 2,
    overflow: 'hidden',
  },
  productImg: { width: '100%', height: 180, resizeMode: 'cover' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0090ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  title: { fontSize: 13, marginTop: 4, marginHorizontal: 4, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 4, marginTop: 2 },
  ratingText: { fontSize: 12, marginLeft: 4, color: '#555' },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 4, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '700', color: '#DC6300' },
  sold: { fontSize: 12, marginLeft: 6, color: '#777' },

  cartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 18,
    elevation: 3,
  },
  floatingIcon: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: '#fff',
  borderRadius: 50,
  padding: 12,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
});
