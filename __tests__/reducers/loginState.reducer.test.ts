import { defaultLoginData } from "../../contexts/loginState.context";
import { defaultListsData } from "../../contexts/lists.context";
import {
    LoginState,
    UpdateAccountCreationError,
    UpdateIsLoginPageVisible,
    UpdateUsername,
    loginStateReducer,
} from "../../data/reducers/loginState.reducer";
import { assertAccountStateEqual } from "../testUtils";

describe("Account Reducer", () => {
    it("updates username", () => {
        const newState: LoginState = loginStateReducer(
            defaultLoginData,
            new UpdateUsername("test")
        );

        const expectedState: LoginState = {
            ...defaultLoginData,
            username: "test",
        };

        assertAccountStateEqual(newState, expectedState);
    });

    it("updates isLoginPageVisible", () => {
        const newState: LoginState = loginStateReducer(
            defaultLoginData,
            new UpdateIsLoginPageVisible(true)
        );

        const expectedState: LoginState = {
            ...defaultLoginData,
            isLoginPageVisible: true,
        };

        assertAccountStateEqual(newState, expectedState);
    });

    it("updates error", () => {
        const newState: LoginState = loginStateReducer(
            defaultLoginData,
            new UpdateAccountCreationError("Please enter a username")
        );

        const expectedState: LoginState = {
            ...defaultLoginData,
            error: "Please enter a username",
        };

        assertAccountStateEqual(newState, expectedState);
    });
});
