import { defaultAppData, defaultSettings } from "../../contexts/app.context";
import {
    AccountState,
    AppData,
    UpdateAccountCreationError,
    UpdateIsAccountCreationModalVisible,
    UpdateUsername,
    appReducer,
} from "../../data/reducers/app.reducer";
import { assertAccountStateEqual } from "../testUtils";

describe("Account Reducer", () => {
    it("updates username", () => {
        const newState: AppData = appReducer(
            defaultAppData,
            new UpdateUsername("test")
        );

        const expectedState: AccountState = {
            username: "test",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });

    it("updates isAccountCreationModalVisible", () => {
        const newState: AppData = appReducer(
            defaultAppData,
            new UpdateIsAccountCreationModalVisible(true)
        );

        const expectedState: AccountState = {
            isAccountCreationModalVisible: true,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });

    it("updates error", () => {
        const newState: AppData = appReducer(
            defaultAppData,
            new UpdateAccountCreationError("Please enter a username")
        );

        const expectedState: AccountState = {
            error: "Please enter a username",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });
});
