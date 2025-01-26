import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, sendPasswordResetEmail } from "firebase/auth"

import type { AuthError, UserCredential, User } from "firebase/auth"

/** Used to sign in with any provider. Will return an error string if there is an issue. */
export async function signIn(provider: AuthProvider, email: string, password: string): Promise<User | undefined> {
    try {
        switch (provider) {
            case "email":
                const user = await signInWithEmail(email, password)
                return user
            case "google":
                const user2 = await signInWithGoogle()
                return user2
        }
    } catch (error) {
        throw new Error(`${error}`)
    }
}

/** Used to sign up with any provider. Will return an error string if there is an issue. */
export async function signUp(provider: AuthProvider, email: string, password: string) {
    switch (provider) {
        case "email":
            if (!email || !password) throw new Error("Email and password are required for email sign-in")
            await signUpWithEmail(email, password)
            break

        case "google":
            await signInWithGoogle()
            break
    }
}

export const signInWithEmail = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password are required for email sign-in.")
    const response = await $fetch<ApiResponse<User>>("/api/auth/login", {
        method: "POST",
        body: {
            email,
            password,
        },
    })

    if (response.ok) {
        const user = response.data as User
        return user
    }
}

export async function signUpWithEmail(email: string, password: string) {
    if (!email || !password) throw new Error("Email and password are required for email sign-up.")
    const response = await $fetch<ApiResponse<User>>("/api/auth/register", {
        method: "POST",
        body: {
            email,
            password,
            domain: "http://localhost:3000",
            role: "staff",
        },
    })
}

export async function signInWithGoogle(): Promise<User | undefined> {
    const $auth = useAuth()
    const provider = new GoogleAuthProvider()

    try {
        await setPersistence($auth, browserLocalPersistence)
        const userCredential: UserCredential = await signInWithPopup($auth, provider)
        const user = userCredential.user

        const response = await $fetch<ApiResponse<User>>(`/api/users/${user.email}`)

        if (response.ok) {
            return response.data as User
        }
    } catch (error: unknown) {
        console.error("Error signing in with Google:", error)
        // const message = getErrorMessage(error as AuthError)
    }
}

export async function resetPassword(email: string) {
    const $auth = useAuth()
    try {
        await sendPasswordResetEmail($auth, email)
        return {
            success: true,
            message: "Password reset email sent! Please check your inbox.",
        }
    } catch (error: unknown) {
        const message = getErrorMessage(error as AuthError)
        return { success: false, message }
    }
}

export const getErrorMessage = (error: AuthError): string => {
    switch (error.code) {
        case "auth/invalid-email":
            return "Invalid email format."
        case "auth/invalid-credential":
            return "Invalid email or password."
        case "auth/email-already-in-use":
            return "The email address is already in use."
        case "auth/operation-not-allowed":
            return "Operation not allowed. You may need to enable this provider in your Firebase project settings."
        case "auth/weak-password":
            return "The password is too weak."
        default:
            return "An unknown error occurred. Please try again."
    }
}
