import { useState, useEffect, useRef } from 'react';

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useAnimatedCounter(target, duration = 1500, startOnMount = true) {
    const [value, setValue] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const frameRef = useRef(null);

    const animate = (from, to) => {
        setIsAnimating(true);
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = from + (to - from) * easedProgress;

            setValue(Math.round(current));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(step);
            } else {
                setValue(to);
                setIsAnimating(false);
            }
        };

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        if (startOnMount && target > 0) {
            animate(0, target);
        }
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [target, startOnMount]);

    const startAnimation = (from = 0) => {
        animate(from, target);
    };

    const formatCurrency = (val) => {
        return '₹' + val.toLocaleString('en-IN');
    };

    return { value, isAnimating, startAnimation, formatted: formatCurrency(value) };
}
