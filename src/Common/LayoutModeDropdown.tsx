import React from 'react';

//constants
import { LAYOUT_MODE_TYPES } from "../Common/constants/layout";


/*
How Theme Switching Works:
Initial State:

The current theme (layoutMode) is passed as a prop to the LayoutModeDropdown component.
Example: layoutMode = LAYOUT_MODE_TYPES.DARKMODE means the current theme is dark.
Theme Toggle Logic:

When the button is clicked, it triggers onChangeLayoutMode(mode).
mode is the opposite of the current layoutMode.
Theme Change Implementation:

The onChangeLayoutMode function, which is implemented in the parent component, handles the actual theme change.
This function likely updates a state variable or modifies the application's theme context.



in the LAYOUT_MODE_TYPES we define a set of enums (enumerations) in TypeScript,
 which are used to represent predefined sets of related values with more meaningful names

*/

const LayoutModeDropdown = ({ layoutMode, onChangeLayoutMode }:any) => {

    const mode = layoutMode === LAYOUT_MODE_TYPES['DARKMODE'] ? LAYOUT_MODE_TYPES['LIGHTMODE'] : LAYOUT_MODE_TYPES['DARKMODE'];
    
    return (
        <div className="ms-1 header-item d-none d-sm-flex">
            <button
                onClick={() => onChangeLayoutMode(mode)}
                type="button" className="btn btn-icon btn-topbar btn-ghost-primary rounded-circle light-dark-mode">
                <i className='las la-moon fs-24'></i>
            </button>
        </div>
    );
};

export default LayoutModeDropdown;