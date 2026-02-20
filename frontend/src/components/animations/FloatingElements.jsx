import { useState, useEffect } from 'react';

export default function FloatingElements({ show, emojis = ['🎉', '🎊', '💰', '✨', '🏆', '💎'] }) {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        if (!show) {
            setElements([]);
            return;
        }

        const newElements = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            left: Math.random() * 100,
            delay: Math.random() * 1,
            duration: 1.5 + Math.random() * 1,
            size: 20 + Math.random() * 20
        }));

        setElements(newElements);

        const timeout = setTimeout(() => setElements([]), 3000);
        return () => clearTimeout(timeout);
    }, [show]);

    if (elements.length === 0) return null;

    return (
        <div className="celebration-overlay">
            {elements.map(el => (
                <span
                    key={el.id}
                    className="floating-emoji"
                    style={{
                        left: `${el.left}%`,
                        bottom: '20%',
                        fontSize: `${el.size}px`,
                        animationDelay: `${el.delay}s`,
                        animationDuration: `${el.duration}s`
                    }}
                >
                    {el.emoji}
                </span>
            ))}
        </div>
    );
}
