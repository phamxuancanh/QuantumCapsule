import React, { useEffect } from "react";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Button } from "@mui/material";
interface IProps{
    text: string;
    autoSpeak?: boolean;
    label: string;
}

const SpeakerV1: React.FC<IProps> = ({ text, autoSpeak = false, label}) => {
  const speakText = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ đọc văn bản.");
    }
  };

  // Dùng useEffect để tự động đọc text khi component render lần đầu
  useEffect(() => {
    if (autoSpeak) {
      speakText();
    }
  }, [autoSpeak]);

  return (
    <Button onClick={speakText} style={{ cursor: "pointer" }} >
        <VolumeUpIcon /> {label}
    </Button>
  );
};

export default SpeakerV1;
