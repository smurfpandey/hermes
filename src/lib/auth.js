import { createAuth0, authGuard } from '@auth0/auth0-vue';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;

export const getAuth0App = () => {
    return createAuth0({
        domain: AUTH0_DOMAIN,
        clientId: AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: window.location.origin,
        },
    });
};

export { authGuard };
