import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { withDevTools } from 'redux-devtools-extension';

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { text: message, from: 'user' }]);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: message,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`,
          },
        }
      );

      if (response.data && response.data.choices) {
        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { text: response.data.choices[0].text, from: 'bot' },
        ]);
      } else {
        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { text: 'Sorry, I could not understand your message.', from: 'bot' },
        ]);
      }

      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Chat with Chatbot</Text>
        <View style={styles.chatContainer}>
          {chatHistory.map((chat, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                chat.from === 'bot' ? styles.botMessageContainer : styles.userMessageContainer,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  chat.from === 'bot' ? styles.botMessageText : styles.userMessageText,
                ]}
              >
                {chat.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here..."
          placeholderTextColor="#BEBEBE"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
  },
  chatContainer: {
    flexDirection: 'column',
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F2',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#BEBEBE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,

    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderRadius: 20,
    marginRight: 10,
  },
});

export default Chat;
