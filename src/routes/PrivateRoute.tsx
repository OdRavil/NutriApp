/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router";
import { useAuth } from "../context/auth";

type RouteComponent =
	| React.FC<RouteComponentProps<{}>>
	| React.ComponentClass<any>;

const PrivateRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
	const auth = useAuth();

	const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
		if (!Component) {
			return null;
		}
		if (auth.signed) {
			return <React.Component {...props} />;
		}
		const { location } = props;
		return <Redirect to={{ pathname: "/", state: { from: location } }} />;
	};

	if (component) {
		return <Route {...rest} component={component} />;
	}
	return <Route {...rest} render={renderFn(component)} />;
};

export default PrivateRoute;
