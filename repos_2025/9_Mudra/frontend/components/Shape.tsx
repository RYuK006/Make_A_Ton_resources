"use client";

import { CSSProperties } from "react";

export type ShapeType = string | null;

interface ShapeProps {
    type: ShapeType;
    size: number;
    position: { x: number; y: number };
    onMouseDown: (e: React.MouseEvent) => void;
}

export default function Shape({ type, size, position, onMouseDown }: ShapeProps) {
    if (!type) return null;

    const baseStyles = "absolute cursor-grab active:cursor-grabbing transition-shadow duration-300 ease-in-out flex items-center justify-center overflow-hidden";
    const normalizedType = type.toLowerCase();

    // Mapping for word-numbers to digits
    const numberMap: Record<string, string> = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
        "ten": "10"
    };

    const displayValue = numberMap[normalizedType] || type;
    const isNumber = !isNaN(Number(displayValue)) || !!numberMap[normalizedType];

    const style: CSSProperties = {
        left: position.x,
        top: position.y,
        width: normalizedType === "triangle" ? 0 : size,
        height: normalizedType === "triangle" ? 0 : size,
    };

    switch (normalizedType) {
        case "circle":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={style}
                    className={`rounded-full bg-indigo-500 border-4 border-black ${baseStyles}`}
                />
            );
        case "square":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={style}
                    className={`bg-rose-500 border-4 border-black ${baseStyles}`}
                />
            );
        case "triangle":
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={{
                        ...style,
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid #10b981`, // emerald-500
                    }}
                    className={`transition-all duration-300 ease-in-out ${baseStyles}`}
                />
            );
        default:
            return (
                <div
                    onMouseDown={onMouseDown}
                    style={{
                        ...style,
                        width: "auto",
                        minWidth: size,
                        padding: "0 1.5rem",
                    }}
                    className={baseStyles.replace("overflow-hidden", "overflow-visible")}
                >
                    <span
                        className={`font-black text-black select-none whitespace-nowrap ${isNumber ? "" : "px-4"}`}
                        style={{ fontSize: `${size * 0.5}px`, lineHeight: 1 }}
                    >
                        {isNumber ? displayValue : type.toUpperCase()}
                    </span>
                </div>
            );
    }
}
