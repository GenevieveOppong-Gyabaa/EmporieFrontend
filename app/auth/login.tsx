import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const login = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.header}> Create a Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter password</Text>
        <TextInput style={styles.textInput} placeholder='password should be at least 6 characters long'></TextInput>
      </View>

      <View style={{...styles.inputContainer ,marginTop:24}}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput style={styles.textInput} placeholder='password should be at least 6 characters long'></TextInput>
      </View>

      <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Set Password</Text>
      </TouchableOpacity>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    container :{
        flex:1 , 
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:16
    },
    header:{
        fontSize:24,
        marginBottom:100

    },
    inputContainer:{
        width:'100%',
    },
    textInput:{
        width:'100%',
        height:50,
        borderWidth:1,
        marginTop:2,
        borderRadius:10,
        paddingHorizontal:20,
        backgroundColor:'white',
        borderColor:'#c3c3c3'
    },
    label:{
        fontSize:20
    },
    button:{
        width:'90%',
        height:60,
        backgroundColor:'#4466ff',
        marginTop:70,
        borderRadius:30,
        alignItems:'center',
        justifyContent:'center'
    }
    , buttonText:{
        color:"#fff",
        fontSize:20
    }
    
})