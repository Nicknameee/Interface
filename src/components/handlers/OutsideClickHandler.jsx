import React, {useEffect} from 'react';

const OutsideClickHandler = ({ outsideClickCallbacks, children }) => {
    useEffect(() => {
        const handleClick = (event) => {
            // Check if the click target is not inside any of the specified containers for each callback
            outsideClickCallbacks.forEach(({ containers, callback }) => {
                const clickedInsideContainers = containers.some(container => container.contains(event.target));
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
