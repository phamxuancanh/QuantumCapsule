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
const SkillList = loadable(async () => await import('pages/skill_list'), {
    fallback: <Loading />
})
const SignIn = loadable(async () => await import('pages/sign_in'), {
    fallback: <Loading />
})
const SignUp = loadable(async () => await import('pages/sign_up'), {
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
const EmailVerifySend = loadable(async () => await import('pages/email_veirfy_send_page'), {
    fallback: <Loading />
})
const EmailVerifySuccess = loadable(async () => await import('pages/email_verify_success_page'), {
    fallback: <Loading />
})
const ResetPassword = loadable(async () => await import('pages/reset_password'), {
    fallback: <Loading />
})
const Profile = loadable(async () => await import('pages/profile'), {
    fallback: <Loading />
})
const SkillPractice = loadable(async () => await import('modules/Practice/PracticeProvider'), {
    fallback: <Loading />
})
/**
 * Use <AuthRoute /> to protect authenticate pages
 */
const routes: RouteObject[] = [
    {
        path: ROUTES.sign_in,
        element: (
            <AuthRoute>
                <SignIn />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.sign_up,
        element: (
            <AuthRoute>
                <SignUp />
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
        path: ROUTES.email_verify_send,
        element: (
            <AuthRoute>
                <EmailVerifySend />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.email_verify_success,
        element: (
            <AuthRoute>
                <EmailVerifySuccess />
            </AuthRoute>
        )
    },
    {
        path: ROUTES.reset_password,
        element: (
            <AuthRoute>
                <ResetPassword />
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
            // { path: ROUTES.dev, element: <Dev /> }
            // { path: ROUTES.forgot_password, element: <ForgotPassword />}
            { path: ROUTES.profile, element: <Profile /> },
            { path: ROUTES.skill_list, element: <SkillList /> }
        ]
    },
    {
        path: ROUTES.dev,
        element: (
            <LayoutDefault />
        ),
        children: [
            { path: ROUTES.dev, element: <Dev /> }
        ]
    },
    {
        path: ROUTES.skill_practice,
        element: (
            <LayoutDefault />
        ),
        children: [
            { path: ROUTES.skill_practice, element: <SkillPractice /> }
        ]
    }
    
]

export default routes
