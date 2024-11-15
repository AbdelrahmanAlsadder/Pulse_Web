import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../helpers/firebase_helper";


const fireBaseBackend = getFirebaseBackend();

export const userForgetPassword = (user: any, history: any) => async (dispatch: any) => {
    try {
        let response;

            response = fireBaseBackend.forgetPassword(
                user.email
            )


        const data = await response;

        if (data) {
            dispatch(userForgetPasswordSuccess(
                "Reset link are sended to your mailbox, check there first"
            ))
        }
    } catch (forgetError) {
        dispatch(userForgetPasswordError(forgetError))
    }
}