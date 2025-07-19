import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const validateEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim());
  };

  const handleContinue = () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    // Navigate if email is valid
    router.replace("./UserInfo");
  };

  return (
    
    
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>
      <Image source={require('../assets/images/signUpImage.png')} style={styles.girl}/>
      <Text>Enter your email to sign up for this app</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 50 }}>
        Already have an account?{" "}
        <Link href="./Login" style={{ color: 'blue', textDecorationLine: 'underline' }}>
          Log in
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 80,
  },
  girl: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#361696',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    opacity: 0.5,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
