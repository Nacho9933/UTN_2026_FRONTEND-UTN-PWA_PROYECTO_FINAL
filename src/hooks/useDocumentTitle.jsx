import { useEffect } from 'react'

const BASE_TITLE = 'Slack'

//pone el titulo de la pestaña como "Slack | <seccion>" (o solo "Slack" si no paso seccion)
export default function useDocumentTitle(section) {
    useEffect(() => {
        document.title = section ? `${BASE_TITLE} | ${section}` : BASE_TITLE
    }, [section])
}
