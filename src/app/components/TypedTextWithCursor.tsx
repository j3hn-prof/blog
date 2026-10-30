import { TypewriterText } from './TypewriterText';

export function TypedTextWithCursor({ text, speed = 100, pause = 500 }: { text: Array<string>; speed: number; pause: number; }) {
    return (
        <>
            <TypewriterText text={text} speed={speed} pause={pause} />
            <span className="animate-blink">█</span>
        </>
    );
}
