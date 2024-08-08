import { useContext, useEffect } from "react";
import AddUpdateContainer from "../AddUpdateContainer";
import CustomInput from "../core/CustomInput";
import { LoginContext } from "../../contexts/loginState.context";
import CustomError from "../core/CustomError";
import {
    UpdateAccountCreationError,
    UpdateIsLoginPageVisible,
    UpdateUsername,
} from "../../data/reducers/loginState.reducer";
import { LoginPageNavigationProps } from "../../types";
import { View } from "react-native";
import CustomButton from "../core/CustomButton";

export default function LoginPage({
    navigation,
    route,
}: LoginPageNavigationProps): JSX.Element {
    const accountContext = useContext(LoginContext);
    const { loginState, loginStateDispatch } = accountContext;
    const { username, isLoginPageVisible, error } = loginState;

    useEffect(() => {
        // Don't show the login page if the user is already logged in.
        if (!isLoginPageVisible) navigation.navigate("Lists");
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton
                        text="Login"
                        onPress={createAccount}
                        testId="add-update-list-next"
                    />
                </View>
            ),
        });
    }, [loginState]);

    const setUsername = (newUsername: string) =>
        loginStateDispatch(new UpdateUsername(newUsername));

    const createAccount = () => {
        if (username === undefined) {
            loginStateDispatch(
                new UpdateAccountCreationError("Please enter a username")
            );
            return;
        }

        loginStateDispatch(new UpdateIsLoginPageVisible(false));

        navigation.navigate("Lists");
    };

    return (
        <AddUpdateContainer>
            <CustomInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter a username"
            />
            <CustomError error={error} />
        </AddUpdateContainer>
    );
}
