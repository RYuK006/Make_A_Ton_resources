"use client";

interface ResizeControlsProps {
    onResize: (amount: number) => void;
}

export default function ResizeControls({ onResize }: ResizeControlsProps) {
    return (
        <div className="fixed flex gap-4 p-6 w-full justify-center z-10 bottom-4">
            <button
                onClick={() => onResize(20)}
                className="px-8 py-2 font-black text-black bg-white border-4 border-black transition-all hover:-translate-y-1 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]"
            >
                LARGER +
            </button>
            <button
                onClick={() => onResize(-20)}
                className="px-8 py-2 font-black text-black bg-white border-4 border-black transition-all hover:-translate-y-1 active:translate-y-0 hover:shadow-[4px_4px_0px_0px_rgba(244,63,94,1)]"
            >
                SMALLER -
            </button>
        </div>
    );
}
