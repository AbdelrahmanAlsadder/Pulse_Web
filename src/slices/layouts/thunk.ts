import { changeHTMLAttribute } from './utils'; // Utility function to change HTML attributes
import {
    changeLayoutAction,
    changeLayoutModeAction,
    changeSidebarThemeAction,
    changeLayoutWidthAction,
    changeLayoutPositionAction,
    changeTopbarThemeAction,
    changeLeftsidebarSizeTypeAction,
    changeLeftsidebarViewTypeAction,
} from './reducer'; // Redux actions to update state

/**
 * Changes the layout type
 * @param {*} layout - The new layout type (e.g., "horizontal" or "vertical")
 */
export const changeLayout = (layout: any) => async (dispatch: any) => {
    try {
        if (layout === "horizontal") {
            // Remove the sidebar size attribute if the layout is horizontal
            document.documentElement.removeAttribute("data-sidebar-size");
        }
        // Update the HTML attribute for layout
        changeHTMLAttribute("data-layout", layout);
        // Dispatch Redux action to update layout state
        dispatch(changeLayoutAction(layout));
    } catch (error) {
        // Handle potential errors
    }
};

/**
 * Changes the layout mode
 * @param {*} layoutMode - The layout mode (e.g., "light" or "dark")
 */
export const changeLayoutMode = (layoutMode: any) => async (dispatch: any) => {
    try {
        // Update the theme attribute based on the layout mode
        switch (layoutMode) {
            case "light":
                changeHTMLAttribute("data-bs-theme", "light");
                break;
            case "dark":
                changeHTMLAttribute("data-bs-theme", "dark");
                break;            
            default:
                changeHTMLAttribute("data-bs-theme", "light");
                break;
        }
        // Dispatch Redux actions to update layout and topbar themes
        dispatch(changeLayoutModeAction(layoutMode));
        dispatch(changeTopbarThemeAction(layoutMode));
    } catch (error) {
        // Handle errors if needed
    }
};

/**
 * Changes the left sidebar theme
 * @param {*} sidebarTheme - The theme for the sidebar
 */
export const changeSidebarTheme = (sidebarTheme: any) => async (dispatch: any) => {
    try {
        // Update the HTML attribute for sidebar theme
        changeHTMLAttribute("data-sidebar", sidebarTheme);        
        // Dispatch Redux action to update sidebar theme state
        dispatch(changeSidebarThemeAction(sidebarTheme));
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
};

/**
 * Changes the layout width
 * @param {*} layoutWidth - The width of the layout (e.g., "fluid" or "boxed")
 */
export const changeLayoutWidth = (layoutWidth: any) => async (dispatch: any) => {
    try {
        // Update the HTML attribute for layout width
        changeHTMLAttribute("data-layout-width", layoutWidth);
        // Dispatch Redux action to update layout width state
        dispatch(changeLayoutWidthAction(layoutWidth));
    } catch (error) {
        return error; // Return error if it occurs
    }
};

/**
 * Changes the layout position
 * @param {*} layoutPosition - The position of the layout (e.g., "fixed" or "scrollable")
 */
export const changeLayoutPosition = (layoutposition: any) => async (dispatch: any) => {
    try {
        // Update the HTML attribute for layout position
        changeHTMLAttribute("data-layout-position", layoutposition);
        // Dispatch Redux action to update layout position state
        dispatch(changeLayoutPositionAction(layoutposition));
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
};

/**
 * Changes the topbar theme
 * @param {*} topbarTheme - The theme for the topbar
 */
export const changeTopbarTheme = (topbarTheme: any) => async (dispatch: any) => {
    try {
        // Update the HTML attribute for topbar theme
        changeHTMLAttribute("data-topbar", topbarTheme);
        // Dispatch Redux action to update topbar theme state
        dispatch(changeTopbarThemeAction(topbarTheme));
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
};

/**
 * Changes the left sidebar size
 * @param {*} leftsidebarSizetype - The size of the left sidebar (e.g., "lg", "md", "sm", "sm-hover")
 */
export const changeLeftsidebarSizeType = (leftsidebarSizetype: any) => async (dispatch: any) => {
    try {
        // Set the sidebar size attribute based on the input
        switch (leftsidebarSizetype) {
            case 'lg':
                changeHTMLAttribute("data-sidebar-size", "lg");
                break;
            case 'md':
                changeHTMLAttribute("data-sidebar-size", "md");
                break;
            case "sm":
                changeHTMLAttribute("data-sidebar-size", "sm");
                break;
            case "sm-hover":
                changeHTMLAttribute("data-sidebar-size", "sm-hover");
                break;
            default:
                changeHTMLAttribute("data-sidebar-size", "lg");
        }
        // Dispatch Redux action to update sidebar size state
        dispatch(changeLeftsidebarSizeTypeAction(leftsidebarSizetype));
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
};

/**
 * Changes the left sidebar view type
 * @param {*} leftsidebarViewtype - The view type for the left sidebar (e.g., "default", "compact")
 */
export const changeLeftsidebarViewType = (leftsidebarViewtype: any) => async (dispatch: any) => {
    try {
        // Update the HTML attribute for sidebar view type
        changeHTMLAttribute("data-layout-style", leftsidebarViewtype);
        // Dispatch Redux action to update sidebar view type state
        dispatch(changeLeftsidebarViewTypeAction(leftsidebarViewtype));
    } catch (error) {
        console.log(error); // Log errors for debugging
    }
};
