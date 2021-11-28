import { useCallback } from "react";
import { useAuth } from "../../context/auth";

const useAuthSigned = () => {
	const { signed, loaded } = useAuth();

	const isSigned = useCallback(
		() => (!loaded ? undefined : signed),
		[loaded, signed]
	);

	return isSigned();
};

export default useAuthSigned;
