"use client";

import { ShapeType } from "./Shape";

interface ShapePickerProps {
    onDrawShape: (type: ShapeType) => void;
}

export default function ShapePicker({ onDrawShape }: ShapePickerProps) {
    return (
        <div className="fixed flex flex-wrap justify-center gap-4 p-4 w-full z-10 ">
            <button
                onClick={() => onDrawShape("circle")}
                className="group relative px-6 py-2 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
                CIRCLE
            </button>
            <button
                onClick={() => onDrawShape("square")}
                className="group relative px-6 py-2 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
                SQUARE
            </button>
            <button
                onClick={() => onDrawShape("triangle")}
                className="group relative px-6 py-2 font-bold text-black bg-white border-4 border-black transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
                TRIANGLE
            </button>
        </div>
    );
}
