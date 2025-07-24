import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Chat() {
  return (
    <View>
      <Text style={styles.title}>Chat Screen</Text>
    </View>
  );
}
/*
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Client } from '@stomp/stompjs';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SockJS from 'sockjs-client';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const dotAnimation1 = useRef(new Animated.Value(0)).current;
  const dotAnimation2 = useRef(new Animated.Value(0)).current;
  const dotAnimation3 = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      startTypingAnimation();
    }
  }, [isTyping]);

 
const clientRef = useRef(null);

useEffect(() => {
  const socket = new SockJS('http://localhost:8080/ws'); // backend must expose /ws
  const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log('Connected to WebSocket');

      client.subscribe('/user/queue/messages', (message) => {
        const msg = JSON.parse(message.body);
        setMessages(prev => [...prev, msg]);
      });
    },
  });

  client.activate();
  clientRef.current = client;

  return () => client.deactivate();
}, []);


  const startTypingAnimation = () => {
    const animateDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDot(dotAnimation1, 0);
    animateDot(dotAnimation2, 133);
    animateDot(dotAnimation3, 266);
  };

 const handleSendMessage = () => {
  if (newMessage.trim() && clientRef.current?.connected) {
    const message = {
      sender: 'user1',
      receiver: 'user2',
      content: newMessage,
      messageType: 'TEXT',
    };

    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });

    setNewMessage('');
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  }
};

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageMessage = {
        id: messages.length + 1,
        image: imageUri,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
      };
      setMessages([...messages, imageMessage]);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.otherMessage]}>
        {!isUser && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.otherBubble]}>
          {item.text && (
            <Text style={[styles.messageText, isUser ? styles.userText : styles.otherText]}>
              {item.text}
            </Text>
          )}
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{ width: 180, height: 180, borderRadius: 12, marginTop: 5 }}
            />
          )}
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.otherTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
        {isUser && <Image source={{ uri: item.avatar }} style={styles.avatar} />}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessage]}>
        <Image
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1' }}
          style={styles.avatar}
        />
        <View style={[styles.messageBubble, styles.otherBubble]}>
          <View style={styles.typingContainer}>
            <Animated.View style={[styles.typingDot, { opacity: dotAnimation1 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dotAnimation2 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dotAnimation3 }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      //Chat Area
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />
       //Input Area
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
            <Ionicons name="image-outline" size={24} color="#361696" />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newMessage.trim() ? '#fff' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
{/*}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { marginRight: 12 },
  profile: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700', color: '#361696' },
  headerStatus: { fontSize: 12, color: '#43A047', marginTop: 2 },
  actionButton: { padding: 8 },
  chatContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: { justifyContent: 'flex-end' },
  otherMessage: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#361696',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  otherText: { color: '#000' },
  timestamp: { fontSize: 11, marginTop: 4 },
  userTimestamp: { color: 'rgba(255,255,255,0.7)' },
  otherTimestamp: { color: '#666' },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: { backgroundColor: '#361696' },
  sendButtonInactive: { backgroundColor: '#ddd' },
  imageUploadButton: {
    padding: 6,
    marginRight: 8,
  },
});

export default ChatRoom;
*/