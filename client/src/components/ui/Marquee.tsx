"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API_URL from "@/lib/api";

interface MarqueeProps {
  text?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
}

export default function Marquee({ text, fontSize, textColor, bgColor }: MarqueeProps) {
  const [content, setContent] = useState("Welcome to Escensio - Flat 20% off on Ecsencio Wah Kiosk");
  const [fSize, setFSize] = useState("12px");
  const [tColor, setTColor] = useState("#ffffff");
  const [bColor, setBColor] = useState("#000000");

  useEffect(() => {
    // If props are provided, use them. Otherwise, try to fetch from settings API.
    if (text) setContent(text);
    if (fontSize) setFSize(fontSize);
    if (textColor) setTColor(textColor);
    if (bgColor) setBColor(bgColor);

    if (!text) {
      fetch(`${API_URL}/api/settings`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.marqueeText) setContent(data.marqueeText);
          if (data.marqueeFontSize) setFSize(data.marqueeFontSize);
          if (data.marqueeTextColor) setTColor(data.marqueeTextColor);
          if (data.marqueeBgColor) setBColor(data.marqueeBgColor);
        })
        .catch(() => { });
    }
  }, [text, fontSize, textColor, bgColor]);

  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap py-3 relative flex items-center"
      style={{ backgroundColor: bColor, color: tColor, fontSize: fSize }}
    >
      <motion.div
        className="flex min-w-full space-x-12 shrink-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
      >
        {/* Double the content to create seamless loop */}
        <span className="font-semibold tracking-wider px-8 uppercase">{content}</span>
        <span className="font-semibold tracking-wider px-8 uppercase">{content}</span>
        <span className="font-semibold tracking-wider px-8 uppercase">{content}</span>
        <span className="font-semibold tracking-wider px-8 uppercase">{content}</span>
      </motion.div>
    </div>
  );
}
