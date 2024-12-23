//this file is used to inject React Router’s 
// location, navigate, and params as props into any component it wraps.
//  This makes it easier for components that 
// are not directly rendered by a <Route> to access routing
//  information such as the current location, navigation functions, and URL parameters.

import {
    useLocation,  // Hook to get the current location (URL) object
    useNavigate,  // Hook to get the navigate function for navigation
    useParams     // Hook to get the URL parameters
} from "react-router-dom";  // Import React Router hooks

// Higher-Order Component (HOC) to provide routing props to the wrapped component
function withRouter(Component: any) {
    // ComponentWithRouterProp is a wrapper component
    // that injects router props into the original component.
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();  // Current location (URL) object
        let navigate = useNavigate();  // Navigate function to programmatically change routes
        let params = useParams();      // URL parameters from the current route

        return (
            <Component
                {...props} // Pass down all the props to the wrapped component
                router={{ location, navigate, params }} // Inject router props into the wrapped component
            />
        );
    }

    return ComponentWithRouterProp;  // Return the wrapper component
}

export default withRouter;  // Export the HOC to be used elsewhere
