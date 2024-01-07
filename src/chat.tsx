import { useState, useEffect } from "react";
import { css } from "@emotion/css";
import axios from "axios";

interface ChatMessage {
  role: string;
  content: string;
}

interface Part {
  text: string;
  // 応答の構造に基づいて他のプロパティがあればここに追加
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
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    const userMessage: ChatMessage = { role: "user", content: input };
    // 画面上の会話履歴を更新
    const updatedChatHistory = [...chatHistory, userMessage];

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
          contents: [{ parts: [{ text: input }] }], // 現在のメッセージのみを送信
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // APIからの応答を処理
      const botResponse = response.data;
      let botMessageContent = "";

      if (
        botResponse &&
        botResponse.candidates &&
        botResponse.candidates.length > 0
      ) {
        const firstCandidate = botResponse.candidates[0].content;
        if (
          firstCandidate &&
          firstCandidate.parts &&
          firstCandidate.parts.length > 0
        ) {
          botMessageContent = firstCandidate.parts
            .map((part: Part) => part.text)
            .join("\n");
        }
      }

      const botMessage: ChatMessage = {
        role: "system",
        content: botMessageContent,
      };

      // 会話履歴を更新（ユーザーとボットのメッセージを含む）
      setChatHistory([...updatedChatHistory, botMessage]);
    } catch (error) {
      console.error("Google API error:", error);
    }

    setInput("");
  };

  return (
    <div className={chatContainerStyle}>
      <div className={chatHistoryStyle}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={
              chat.role === "user" ? userMessageStyle : botMessageStyle
            }
          >
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
      <button onClick={sendMessage} className={buttonStyle}>
        Send
      </button>
    </div>
  );
};

export default App;
