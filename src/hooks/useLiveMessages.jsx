import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Trae mensajes y los mantiene actualizados con polling.
 * - La primera carga (o al cambiar de canal/conversación) muestra el loading.
 * - Después refresca en silencio cada `intervalMs` para que lleguen los mensajes nuevos
 *   sin parpadeo del spinner.
 */
export default function useLiveMessages(fetchFn, deps = [], intervalMs = 3000) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    //guardo la última fetchFn en un ref para que el intervalo siempre use la actual sin recrearse
    const fetchRef = useRef(fetchFn)
    fetchRef.current = fetchFn

    //refresco silencioso: actualiza los mensajes sin tocar el estado de loading
    const refresh = useCallback(async () => {
        try {
            const response = await fetchRef.current()
            setMessages(response?.data?.messages || [])
            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }, [])

    useEffect(() => {
        let activo = true
        setLoading(true)

        //primera carga: esta sí muestra el loader
        fetchRef.current()
            .then((response) => {
                if (!activo) return
                setMessages(response?.data?.messages || [])
                setError(null)
            })
            .catch((err) => {
                if (activo) setError(err.message)
            })
            .finally(() => {
                if (activo) setLoading(false)
            })

        //polling silencioso (se pausa si la pestaña no está visible para no gastar requests)
        const intervalId = setInterval(() => {
            if (!document.hidden) refresh()
        }, intervalMs)

        return () => {
            activo = false
            clearInterval(intervalId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { messages, loading, error, refresh }
}
