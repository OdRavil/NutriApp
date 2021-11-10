import React, { CSSProperties } from "react";
import { Color, SpinnerTypes } from "@ionic/core";
import { IonSpinner } from "@ionic/react";

export interface LoadingSpinnerProps {
	color?: Color;
	name?: SpinnerTypes;
	style?: CSSProperties;
	customClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => (
	<div
		style={
			props.style ? props.style : { marginTop: "10px", marginBottom: "10px" }
		}
		className={props.customClassName ? props.customClassName : "ion-text-center"}
	>
		<IonSpinner name={props.name} color={props.color} />
	</div>
);

export default LoadingSpinner;
