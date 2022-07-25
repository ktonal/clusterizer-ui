import React from "react";

export const clientId = "863727113794-4fu7g43eic4ki6jkkmfp3qc9np655kkh.apps.googleusercontent.com";
export const AuthContext = React.createContext({
    token: null, setToken: () => {}, expiresAt: 0, refreshToken: () => {}
});