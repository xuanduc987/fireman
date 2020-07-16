import { useRef, useEffect } from 'react';

export const useDocTitle = (title: string) => {
  let oldTitle = useRef(document.title);
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = oldTitle.current;
    };
  }, [title]);
};

export const useMounted = () => {
  let mounted = useRef(true);
  useEffect(() => {
    mounted.current = false;
  });
  return mounted;
};
