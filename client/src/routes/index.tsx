import AuthRoute from 'containers/auth/auth-route'
import LayoutDefault from 'containers/layouts/default'
import Loading from 'containers/loadable-fallback/loading'
import ROUTES from './constant'
import { RouteObject } from 'react-router-dom'
import loadable from '@loadable/component'

import React from 'react'

/**
 * Lazy load page components. Fallback to <Loading /> when in loading phase
 */
const Home = loadable(async () => await import('pages/home'), {
    fallback: <Loading />
})
const Login = loadable(async () => await import('pages/login'), {
    fallback: <Loading />
})
const NotFound = loadable(async () => await import('pages/not-found'), {
    fallback: <Loading />
})
const Dev = loadable(async () => await import('pages/dev'), {
    fallback: <Loading />
})
const ForgotPassword = loadable(async () => await import('pages/forgot_password'), {
    fallback: <Loading />
})
const EmailVerify = loadable(async () => await import('pages/email_verify_page'), {
    fallback: <Loading />
})
/**
 * Use <AuthRoute /> to protect authenticate pages
 */
const routes: RouteObject[] = [
    {
        path: ROUTES.login,
        element: (
            <AuthRoute>
                <Login />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.forgot_password,
        element: (
            <AuthRoute>
                <ForgotPassword />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.email_verify,
        element: (
            <AuthRoute>
                <EmailVerify />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.home,
        element: (
            <AuthRoute>
                <LayoutDefault />
            </AuthRoute>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: ROUTES.notfound, element: <NotFound /> },
            { path: ROUTES.dev, element: <Dev /> }
            // { path: ROUTES.forgot_password, element: <ForgotPassword />}
        ]
    }
    
]

export default routes
