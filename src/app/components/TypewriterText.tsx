'use client'

import { useState, useEffect } from 'react';

export function TypewriterText({
    text, speed = 100, pause = 500
}: {
    text: Array<string>;
    speed?: number;
    pause?: number;
}) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentStringIndex, setCurrentStringIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    useEffect(() => {
        if (currentStringIndex >= text.length) return;

        const currentString = text[currentStringIndex];

        if (currentCharIndex < currentString.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + currentString[currentCharIndex]);
                setCurrentCharIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (currentStringIndex < text.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentStringIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, pause);

            return () => clearTimeout(timeout);
        }
    }, [displayedText, currentStringIndex, currentCharIndex, text, speed, pause]);

    return <span>{displayedText}</span>;
}
