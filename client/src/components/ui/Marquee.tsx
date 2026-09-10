"use client";

import { motion } from "framer-motion";
import { useSettings } from "../providers/SettingsContext";

interface MarqueeProps {
  text?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
}

export default function Marquee({ text, fontSize, textColor, bgColor }: MarqueeProps) {
  const { settings } = useSettings();

  const content = text || settings.marqueeText || "HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY • BOTANICAL EXTRACTS";
  const fSize = fontSize || settings.marqueeFontSize || "11px";
  const tColor = textColor || settings.marqueeTextColor || "#C89D54";
  const bColor = bgColor || settings.marqueeBgColor || "#181410";

  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap py-2.5 relative flex items-center border-b border-[#332A22]"
      style={{ backgroundColor: bColor, color: tColor, fontSize: fSize }}
    >
      <motion.div
        className="flex min-w-full space-x-12 shrink-0 font-mono tracking-[0.25em] uppercase font-semibold"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 18, repeat: Infinity }}
      >
        <span className="px-6">{content}</span>
        <span className="px-6">•</span>
        <span className="px-6">{content}</span>
        <span className="px-6">•</span>
        <span className="px-6">{content}</span>
        <span className="px-6">•</span>
        <span className="px-6">{content}</span>
      </motion.div>
    </div>
  );
}
