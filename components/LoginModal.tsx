import { useContext } from "react";
import {
    UpdateAccountCreationError,
    UpdateIsAccountCreationModalVisible,
    UpdateUsername,
} from "../data/reducers/account.reducer";
import CustomInput from "./core/CustomInput";
import CustomModal from "./core/CustomModal";
import CustomError from "./core/CustomError";
import { AccountContext } from "../contexts/account.context";
import { ModalButton } from "../types";

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
        if (username === undefined) {
            accountDispatch(
                new UpdateAccountCreationError("Please enter a username")
            );
            return;
        }

        accountDispatch(new UpdateIsAccountCreationModalVisible(false));
    };

    const positiveAction: ModalButton = {
        text: "Create",
        onPress: createAccount,
    };

    return (
        <CustomModal
            testId="login-modal"
            title="Create an Account"
            isVisible={isAccountCreationModalVisible}
            positiveAction={positiveAction}
            error={error}
        >
            <CustomInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter a username"
            />
        </CustomModal>
    );
}
