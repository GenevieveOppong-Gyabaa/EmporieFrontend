import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://your-backend.com/api/chat');
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message || 'Could not fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!newMessage) return;
    setSending(true);
    try {
      const response = await fetch('https://your-backend.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const message = await response.json();
      setMessages([message, ...messages]);
      setNewMessage('');
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#361696" />;
  if (error) return <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageDate}>{item.date}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
          <Text style={styles.sendText}>{sending ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageItem: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  messageText: { fontSize: 16, marginBottom: 4 },
  messageDate: { color: '#666', fontSize: 12 },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#ddd', marginRight: 8 },
  sendBtn: { backgroundColor: '#361696', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});