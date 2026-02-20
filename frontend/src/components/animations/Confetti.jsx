import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
    const fireConfetti = useCallback(() => {
        // Main burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6B46C1', '#3B82F6', '#F59E0B', '#10B981', '#F97316']
        });

        // Left side
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6B46C1', '#3B82F6', '#F59E0B']
            });
        }, 150);

        // Right side
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6B46C1', '#3B82F6', '#F59E0B']
            });
        }, 300);
    }, []);

    const fireBalanceCelebration = useCallback(() => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#F59E0B', '#6B46C1', '#3B82F6']
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#F59E0B', '#6B46C1', '#3B82F6']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        // Initial big burst
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#F59E0B', '#6B46C1', '#3B82F6', '#10B981', '#F97316'],
            ticks: 200,
            gravity: 0.8
        });

        frame();
    }, []);

    return { fireConfetti, fireBalanceCelebration };
}
