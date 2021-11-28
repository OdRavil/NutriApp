/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";

interface PrivateRouteProps extends RouteProps {
	// eslint-disable-next-line react/require-default-props
	signed?: boolean;
}

type RouteComponent =
	| React.FC<RouteComponentProps<{}>>
	| React.ComponentClass<any>;

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	component,
	signed,
	...rest
}) => {
	if (typeof signed === "undefined") return null;

	if (!signed) return <Redirect to={{ pathname: "/" }} />;

	const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
		if (!Component) {
			return null;
		}
		return <React.Component {...props} />;
	};

	if (component) {
		return <Route {...rest} component={component} />;
	}
	return <Route {...rest} render={renderFn(component)} />;
};

export default PrivateRoute;
