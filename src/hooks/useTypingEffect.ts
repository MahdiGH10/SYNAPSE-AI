'use client';

import { useState, useEffect } from 'react';

interface UseTypingEffectOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export const useTypingEffect = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
}: UseTypingEffectOptions) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (text.length < currentWord.length) {
            setText(currentWord.slice(0, text.length + 1));
          } else {
            // Wait before deleting
            setTimeout(() => setIsDeleting(true), delayBetweenWords);
          }
        } else {
          // Deleting
          if (text.length > 0) {
            setText(currentWord.slice(0, text.length - 1));
          } else {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return { text, isDeleting };
};
