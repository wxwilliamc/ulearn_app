export const isMentor = (userId?: string | null) => {
    return userId === process.env.NEXT_PUBLIC_MENTOR_ID;
}