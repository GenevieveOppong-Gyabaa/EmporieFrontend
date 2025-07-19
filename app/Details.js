// ProductDetailsScreen.js — compact but complete 👇
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Item1 from "../assets/images/Item1.png";
import Item2 from "../assets/images/Item2.png";
import Item16 from "../assets/images/Item 16.png";
import Item17 from "../assets/images/Item 17.png";


/* QUICK DATA EDITS */
const PRODUCT = {
  title: "Women's Ribbed Tank Top",
  images: [require("../assets/images/Item1.png")],
  description: "Beautiful bracelets. Perfect for special occasions and casual dayss. Grab yours now!!!.",
  price: 20,
  tyepe: "crystal beads",
};
const SIMILAR = [
  { id: "1", title: "Mixed beads", price: 29.9, img: require("../assets/images/Item 16.png") },
  { id: "2", title: "Mixed beads with a different pendant", price: 32.5, img: require("../assets/images/Item 17.png") },
 
];
const REVIEWS = [{ id: 1, usr: "Ni***an 🇮🇪", txt: "Very comfy", rating: 5 }];

/* CONSTANTS */
const PRIMARY = "#361696";
const SIZES = ["S", "M", "L", "XL", "XXL"];
const W = Dimensions.get("window").width;

export default function ProductDetailsScreen() {
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const starRow = (r) => (
    <View style={{ flexDirection: "row" }}>{[...Array(5)].map((_, i) => <Ionicons key={i} name={i < r ? "star" : "star-outline"} size={16} color={PRIMARY} />)}</View>
  );
  return (
    <SafeAreaView style={styles.c}> 
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* images */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={(e)=>setIdx(Math.round(e.nativeEvent.contentOffset.x/W))} scrollEventThrottle={16}>
          {PRODUCT.images.map((s,i)=><Image key={i} source={s} style={{width:W,height:W*1.2}} />)}
        </ScrollView>
        <View style={styles.d}>{PRODUCT.images.map((_,i)=><View key={i} style={[styles.dot, idx===i&&{backgroundColor:PRIMARY}]} />)}</View>
        {/* title */}
        <Text style={styles.t}>{PRODUCT.title}</Text>
        <View style={styles.r}><Ionicons name="star" size={16} color={PRIMARY}/><Text style={styles.rt}>4.5 (48)</Text></View>
        {/* price */}
        <View style={styles.p}><Text style={styles.pc}>GH₵{PRODUCT.price}</Text><Text style={styles.po}>GH₵{PRODUCT.oldPrice}</Text></View>
        {/* desc */}
        <Text style={styles.h}>Description</Text><Text style={styles.desc}>{PRODUCT.description}</Text>
        {/* sizes */}
        <Text style={styles.h}>Size</Text>
        <View style={styles.srow}>{SIZES.map(s=><TouchableOpacity key={s} onPress={()=>setSize(s)} style={[styles.spill,size===s&&styles.spillA]}><Text style={[styles.stxt,size===s&&styles.stxtA]}>{s}</Text></TouchableOpacity>)}</View>
        {/* qty */}
        <View style={styles.qrow}><Text style={styles.h}>Qty</Text><View style={styles.qctrl}><TouchableOpacity onPress={()=>setQty(Math.max(1,qty-1))}><Ionicons name="remove" size={18} color={PRIMARY}/></TouchableOpacity><Text style={styles.q}>{qty}</Text><TouchableOpacity onPress={()=>setQty(qty+1)}><Ionicons name="add" size={18} color={PRIMARY}/></TouchableOpacity></View></View>
        {/* reviews */}
        <Text style={styles.h}>Reviews</Text>
        {REVIEWS.map(r=><View key={r.id} style={styles.rev}><Text style={styles.revU}>{r.usr}</Text>{starRow(r.rating)}<Text>{r.txt}</Text></View>)}
        {/* similar */}
        <Text style={styles.h}>You may also like</Text>
        <FlatList horizontal data={SIMILAR} keyExtractor={i=>i.id} showsHorizontalScrollIndicator={false} renderItem={({item})=>(<View style={styles.sim}><Image source={item.img} style={styles.simImg}/><Text numberOfLines={1}>{item.title}</Text><Text style={{color:PRIMARY,fontWeight:"700"}}>GH₵{item.price}</Text></View>)}/>
        <View style={{height:100}} />
      </ScrollView>
      <View style={styles.cta}><TouchableOpacity style={styles.buy} onPress={()=>alert(`Added ${qty} x size ${size}`)}><Text style={styles.bt}>Add to cart</Text></TouchableOpacity></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c:{flex:1,backgroundColor:"#fff"},d:{flexDirection:"row",justifyContent:"center",margin:6},dot:{width:8,height:8,borderRadius:4,backgroundColor:"#ccc",margin:2},
  t:{fontSize:18,fontWeight:"600",marginHorizontal:16,color:"#111"},r:{flexDirection:"row",alignItems:"center",marginHorizontal:16,marginTop:4},rt:{marginLeft:4,color:"#555"},
  p:{flexDirection:"row",alignItems:"center",marginHorizontal:16,marginTop:8},pc:{fontSize:20,fontWeight:"700",color:PRIMARY,marginRight:8},po:{textDecorationLine:"line-through",color:"#888"},
  h:{fontSize:15,fontWeight:"600",marginHorizontal:16,marginTop:16,marginBottom:6},desc:{marginHorizontal:16,color:"#444"},
  srow:{flexDirection:"row",flexWrap:"wrap",marginHorizontal:16},spill:{borderWidth:1,borderColor:"#ccc",borderRadius:16,paddingHorizontal:12,paddingVertical:4,marginRight:8,marginBottom:8},spillA:{borderColor:PRIMARY,backgroundColor:PRIMARY+"20"},stxt:{color:"#444"},stxtA:{color:PRIMARY,fontWeight:"700"},
  qrow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginHorizontal:16,marginTop:12},qctrl:{flexDirection:"row",alignItems:"center",borderWidth:1,borderColor:"#ccc",borderRadius:20,paddingHorizontal:8},q:{minWidth:32,textAlign:"center",fontWeight:"600"},
  rev:{marginHorizontal:16,marginVertical:8},revU:{fontWeight:"600",color:"#222"},
  sim:{width:120,marginRight:12},simImg:{width:120,height:140,borderRadius:8,marginBottom:4},
  cta:{position:"absolute",bottom:0,left:0,right:0,backgroundColor:"#fff",padding:16,borderTopWidth:1,borderColor:"#eee"},buy:{backgroundColor:PRIMARY,borderRadius:30,paddingVertical:14,alignItems:"center"},bt:{color:"#fff",fontWeight:"700",fontSize:16}
});
