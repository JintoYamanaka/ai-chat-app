import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import axios from 'axios'; // HTTPリクエスト用

// チャットメッセージのインターフェイス
interface ChatMessage {
  user: string;
  message: string;
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
    const userMessage: ChatMessage = { user: 'You', message: input };
    setChatHistory([...chatHistory, userMessage]);

    // ChatGPT APIにリクエストを送信
    const response = await axios.post('API_ENDPOINT', { message: input });
    const botMessage: ChatMessage = { user: 'Bot', message: response.data };

    setChatHistory([...chatHistory, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className={chatContainerStyle}>
      <div className={chatHistoryStyle}>
        {chatHistory.map((chat, index) => (
          <div key={index} className={chat.user === 'You' ? userMessageStyle : botMessageStyle}>
            {chat.message}
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
