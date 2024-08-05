import {
    SettingsState,
    settingsStateReducer,
    UpdateIsDeleteModalVisible,
} from "../../data/reducers/settingsState.reducer";
import { assertSettingsStateEqual } from "../testUtils";

describe("Settings State Reducer", () => {
    it("updates is delete settings modal visible", () => {
        const state: SettingsState = {
            isDeleteModalVisible: false,
        };
        const newState: SettingsState = settingsStateReducer(
            state,
            new UpdateIsDeleteModalVisible(true)
        );
        const expectedState: SettingsState = {
            isDeleteModalVisible: true,
        };
        assertSettingsStateEqual(newState, expectedState);
    });
});
