import { useContext } from "react";
import {
    UpdateAccountCreationError,
    UpdateIsAccountCreationModalVisible,
    UpdateUsername,
} from "../data/reducers/account.reducer";
import CustomInput from "./core/CustomInput";
import CustomModal from "./core/CustomModal";
import { AppContext } from "../contexts/app.context";
import CustomError from "./core/CustomError";
import { AccountContext } from "../contexts/account.context";

type LoginModalProps = {};

export default function LoginModal(props: LoginModalProps): JSX.Element {
    const accountContext = useContext(AccountContext);
    const {
        account: { username, isAccountCreationModalVisible, error },
        accountDispatch,
    } = accountContext;

    const setUsername = (newUsername: string) =>
        accountDispatch(new UpdateUsername(newUsername));

    const createAccount = () => {
        console.log("create account", username);
        if (username === undefined) {
            accountDispatch(
                new UpdateAccountCreationError("Please enter a username")
            );
            return;
        }

        accountDispatch(new UpdateIsAccountCreationModalVisible(false));
    };

    return (
        <CustomModal
            testId="login-modal"
            title="Create an Account"
            isVisible={isAccountCreationModalVisible}
            positiveActionText="Create"
            positiveAction={createAccount}
        >
            <CustomInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter a username"
            />

            <CustomError error={error} />
        </CustomModal>
    );
}
