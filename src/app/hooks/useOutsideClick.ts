import { useEffect } from 'react';

export const useOutsideClick = (handler: () => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!(event.target instanceof Node) || event.target.closest('.dropdown')) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [handler]);
};
