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
