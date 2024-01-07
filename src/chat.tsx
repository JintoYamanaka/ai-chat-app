import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import axios from 'axios'; // HTTPリクエスト用

// チャットメッセージのインターフェイス
interface ChatMessage {
  role: string;
  content: string;
}

// Emotion CSSスタイル
const chatContainerStyle = css`
  /* コンテナスタイル */
`;

const chatHistoryStyle = css`
  /* チャット履歴スタイル */
`;

const userMessageStyle = css`
  /* ユーザーメッセージスタイル */
`;

const botMessageStyle = css`
  /* ボットメッセージスタイル */
`;

const inputStyle = css`
  /* 入力フィールドスタイル */
`;

const buttonStyle = css`
  /* 送信ボタンスタイル */
`;

const App = () => {
    const [input, setInput] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
    const sendMessage = async () => {
      const userMessage: ChatMessage = { role: 'user', content: input };
      setChatHistory([...chatHistory, userMessage]);
  
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo",
            messages: chatHistory.concat(userMessage)
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        const botMessage: ChatMessage = { role: 'system', content: response.data.choices[0].message.content };
        setChatHistory([...chatHistory, userMessage, botMessage]);
      } catch (error) {
        console.error('ChatGPT API error:', error);
        // エラー処理
      }
  
      setInput('');
    };
  
    return (
      <div className={chatContainerStyle}>
        <div className={chatHistoryStyle}>
          {chatHistory.map((chat, index) => (
            <div key={index} className={chat.role === 'user' ? userMessageStyle : botMessageStyle}>
              {chat.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={inputStyle}
        />
        <button onClick={sendMessage} className={buttonStyle}>Send</button>
      </div>
    );
  };
  
  export default App;
