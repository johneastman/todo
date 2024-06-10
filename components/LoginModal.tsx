import { useContext } from "react";
import {
    UpdateAccountCreationError,
    UpdateIsAccountCreationModalVisible,
    UpdateUsername,
} from "../data/reducers/app.reducer";
import CustomInput from "./core/CustomInput";
import CustomModal from "./core/CustomModal";
import { AppContext } from "../contexts/app.context";
import CustomError from "./core/CustomError";

type LoginModalProps = {};

export default function LoginModal(props: LoginModalProps): JSX.Element {
    const appContext = useContext(AppContext);
    const {
        data: {
            accountState: { username, isAccountCreationModalVisible, error },
        },
        dispatch: appDispatch,
    } = appContext;

    const setUsername = (newUsername: string) =>
        appDispatch(new UpdateUsername(newUsername));

    const createAccount = () => {
        if (username === undefined) {
            appDispatch(
                new UpdateAccountCreationError("Please enter a username")
            );
            return;
        }

        appDispatch(new UpdateIsAccountCreationModalVisible(false));
    };

    return (
        <CustomModal
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
