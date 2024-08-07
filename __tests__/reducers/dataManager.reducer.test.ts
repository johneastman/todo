import {
    CloudManagerState,
    UpdateAll,
    UpdateLoading,
    UpdateMessage,
    cloudManagerReducer,
} from "../../data/reducers/cloudManager.reducer";
import { assertCloudManagerStateEqual } from "../testUtils";

describe("Data Manager Reducer", () => {
    const state: CloudManagerState = {
        isLoading: false,
        message: undefined,
    };

    it("updates message", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateMessage("test message")
        );
        const expectedState: CloudManagerState = {
            isLoading: false,
            message: "test message",
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });

    it("updates loading", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateLoading(true)
        );
        const expectedState: CloudManagerState = {
            isLoading: true,
            message: undefined,
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });

    it("updates all", () => {
        const actualState: CloudManagerState = cloudManagerReducer(
            state,
            new UpdateAll(true, "test message")
        );
        const expectedState: CloudManagerState = {
            isLoading: true,
            message: "test message",
        };
        assertCloudManagerStateEqual(actualState, expectedState);
    });
});
