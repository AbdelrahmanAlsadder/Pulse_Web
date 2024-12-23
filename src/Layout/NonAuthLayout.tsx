// layout component is responsible for dynamically applying layout settings (like layout type and mode) throughout the application
//it controls the layout of the login page which can be edited from the redux
import React, { useEffect } from 'react';
import withRouter from '../Common/withRouter';

// Redux
import { useDispatch, useSelector } from "react-redux";

// Import actions
import {
    changeLayout,
    // changeLayoutTheme,
    changeLayoutMode,
} from "../slices/thunk";

const NonAuthLayout = ({ children }: any) => {
    const dispatch: any = useDispatch();  // Redux dispatch function to trigger actions

    // Using `useSelector` to access the current layout settings from Redux state
    const {
        layoutType,
        layoutThemeType,
        layoutModeType,
    } = useSelector((state: any) => ({
        layoutType: state.Layout.layoutType,
        layoutThemeType: state.Layout.layoutThemeType,
        layoutModeType: state.Layout.layoutModeType,
    }));

    // useEffect to update layout settings whenever the layout values change
    useEffect(() => {
        if (
            layoutType ||  // Check if layoutType is available
            layoutThemeType ||  // Check if layoutThemeType is available
            layoutModeType  // Check if layoutModeType is available
        ) {
            // Trigger a window resize event after layout changes (to recalculate styles, etc.)
            window.dispatchEvent(new Event('resize'));
            
            // Dispatch actions to change layout settings in the Redux store
            // dispatch(changeLayoutTheme(layoutThemeType)); // Currently commented out
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayout(layoutType));
        }
    }, [layoutType, layoutThemeType, layoutModeType, dispatch]);  // Dependencies: will rerun if these values change

    // useEffect to apply the layout mode (dark or light) to the document body
    useEffect(() => {
        if (layoutModeType === "dark") {
            document.body.setAttribute("data-layout-mode", "dark");  // Apply dark mode attribute to body
        } else {
            document.body.setAttribute("data-layout-mode", "light");  // Apply light mode attribute to body
        }

        // Cleanup: remove the layout mode attribute on component unmount
        return () => {
            document.body.removeAttribute("data-layout-mode");
        };
    }, [layoutModeType]);  // Runs when layoutModeType changes

    return (
        <React.Fragment>
            <div>
                {children}  {/* Render the child components */}
            </div>
        </React.Fragment>
    );
};

export default withRouter(NonAuthLayout);  // Wrap the component with withRouter HOC to get access to router props
