import { useEffect, useRef } from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval (callback: () => void, delay?: number | null) {
    const savedCallback: any = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick () {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval;
