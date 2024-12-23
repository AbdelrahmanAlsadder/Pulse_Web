//this file is used for the logic of getting the full screen

import React, { useState } from 'react';

const FullScreenDropdown = () => {
    /*
    mode
    */
    const [isFullScreenMode, setIsFullScreenMode] = useState(true);

    /*
    full screen
    */
    const toggleFullscreen = () => {
        let document:any = window.document;
        document.body.classList.add("fullscreen-enable");

        if (
            !document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            setIsFullScreenMode(false);
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
            /*
            Different browsers use different APIs for fullscreen
            Requests the browser to enter fullscreen mode for the entire document.
            requestFullscreen: Standard API.
            mozRequestFullScreen: Firefox-specific.
            webkitRequestFullscreen: Safari/Chrome-specific.
            */
        } else {
            setIsFullScreenMode(true);
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            //same as the above but to exit full screen
        }

        // handle fullscreen exit
        /*
        Adds event listeners for detecting changes in fullscreen state.
        The exitHandler function ensures that when fullscreen mode exits (via any method),
         the fullscreen-enable class is removed from the <body> element.
        */
        const exitHandler = () => {
            if (
                !document.webkitIsFullScreen &&
                !document.mozFullScreen &&
                !document.msFullscreenElement
            )
                document.body.classList.remove("fullscreen-enable");
        };
        document.addEventListener("fullscreenchange", exitHandler);
        document.addEventListener("webkitfullscreenchange", exitHandler);
        document.addEventListener("mozfullscreenchange", exitHandler);
    };
    return (
        <React.Fragment>
            <div className="ms-1 header-item d-none d-sm-flex">
                <button
                    onClick={toggleFullscreen}
                    type="button"
                    className="btn btn-icon btn-topbar btn-ghost-primary rounded-circle"
                >
                    <i className={isFullScreenMode ? 'las la-expand fs-24' : "las la-compress fs-24"}></i>
                </button>
            </div>
        </React.Fragment>
    );
};

export default FullScreenDropdown;