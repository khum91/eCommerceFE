import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (heraders) => {
            const token = localStorage.getItem('at') || null
            if (token) {
                heraders.set('Authorization', 'Bearer ' + token)
            }
        }
    }),

    endpoints: (builder) => ({
        login: builder.mutation<any, any>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials
            })
        }),

        getLoggedInUser: builder.query<any, void>({
            query: () => '/auth/me'
        })
    })
})

export const { useLoginMutation, useGetLoggedInUserQuery } = authApi