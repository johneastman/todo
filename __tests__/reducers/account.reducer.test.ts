import { defaultAccountData } from "../../contexts/account.context";
import { defaultAppData } from "../../contexts/app.context";
import {
    Account,
    UpdateAccountCreationError,
    UpdateIsAccountCreationModalVisible,
    UpdateUsername,
    accountReducer,
} from "../../data/reducers/account.reducer";
import { assertAccountStateEqual } from "../testUtils";

describe("Account Reducer", () => {
    it("updates username", () => {
        const newState: Account = accountReducer(
            defaultAccountData,
            new UpdateUsername("test")
        );

        const expectedState: Account = {
            username: "test",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState, expectedState);
    });

    it("updates isAccountCreationModalVisible", () => {
        const newState: Account = accountReducer(
            defaultAccountData,
            new UpdateIsAccountCreationModalVisible(true)
        );

        const expectedState: Account = {
            isAccountCreationModalVisible: true,
        };

        assertAccountStateEqual(newState, expectedState);
    });

    it("updates error", () => {
        const newState: Account = accountReducer(
            defaultAccountData,
            new UpdateAccountCreationError("Please enter a username")
        );

        const expectedState: Account = {
            error: "Please enter a username",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState, expectedState);
    });
});
