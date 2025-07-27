import { BACKEND_URL } from '../constants/config';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
}

export const createChatRoom = async (productId: string, sellerId: string, buyerId: string): Promise<ChatRoom> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, sellerId, buyerId }),
    });
    if (!response.ok) {
      throw new Error('Failed to create chat room');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

export const getChatMessages = async (chatRoomId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat/rooms/${chatRoomId}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const sendMessage = async (chatRoomId: string, content: string, senderId: string): Promise<Message> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat/rooms/${chatRoomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, senderId }),
    });
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getUserChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat/rooms/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user chat rooms');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user chat rooms:', error);
    throw error;
  }
}; 