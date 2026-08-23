export const handleAsync = async <T> (
    fn: () => Promise<T>
): Promise<{ 
    success: true; data: T} | { success: false; message: string
    details?: unknown, field?: string
    }> => {
        try {
            const data = await fn()
            return { success: true, data}
        } catch (error: any) {
            return {
            success: false,
            message: error.message || "Something went wrong",
            details: error.details,
            field: error.field
        }
        }
}