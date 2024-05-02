import React, {useEffect} from 'react';

const OutsideClickHandler = ({ outsideClickCallbacks, children }) => {
    useEffect(() => {
        const handleClick = (event) => {
            outsideClickCallbacks.forEach(({ containers, callback }) => {
                const clickedInsideContainers = containers.filter(c => c !== undefined && c !== null).some(container => container.contains(event.target));
                if (!clickedInsideContainers) {
                    callback();
                }
            });
        };

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [outsideClickCallbacks]);

    return <>{children}</>;
};

export default OutsideClickHandler;
