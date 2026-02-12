import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
    "Establishing secure connection...",
    "Verifying user credentials...",
    "Preparing your cart...",
    "Setting up your items...",
    "Finalizing secure environment..."
];

const LoadingScreen = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'var(--color-background)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative"
            >
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '4px solid var(--color-border)',
                        borderTop: '4px solid var(--color-primary)',
                        position: 'relative',
                        zIndex: 10
                    }}
                />

                {/* Inner Ring (Pulsing) */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-light)',
                        opacity: 0.1,
                        zIndex: 1
                    }}
                />
            </motion.div>

            <div style={{ marginTop: '2rem', height: '20px', textAlign: 'center' }}>
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={messageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            color: 'var(--color-secondary)',
                            fontFamily: 'var(--font-family-sans)',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em'
                        }}
                    >
                        {loadingMessages[messageIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoadingScreen;
