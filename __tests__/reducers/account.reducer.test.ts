import { defaultSettings } from "../../contexts/app.context";
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
    const state: AppData = {
        settings: defaultSettings,
        lists: [],
        itemsState: {
            currentIndex: -1,
            isModalVisible: false,
            isCopyModalVisible: false,
            isDeleteAllModalVisible: false,
        },
        listsState: {
            currentIndex: -1,
            isModalVisible: false,
            isDeleteAllModalVisible: false,
        },
        accountState: {
            isAccountCreationModalVisible: false,
        },
    };

    it("updates username", () => {
        const newState: AppData = appReducer(state, new UpdateUsername("test"));

        const expectedState: AccountState = {
            username: "test",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });

    it("updates isAccountCreationModalVisible", () => {
        const newState: AppData = appReducer(
            state,
            new UpdateIsAccountCreationModalVisible(true)
        );

        const expectedState: AccountState = {
            isAccountCreationModalVisible: true,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });

    it("updates error", () => {
        const newState: AppData = appReducer(
            state,
            new UpdateAccountCreationError("Please enter a username")
        );

        const expectedState: AccountState = {
            error: "Please enter a username",
            isAccountCreationModalVisible: false,
        };

        assertAccountStateEqual(newState.accountState, expectedState);
    });
});
