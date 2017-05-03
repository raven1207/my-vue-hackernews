import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'prodution'

export default context => {
    return new Promise((resolve, reject) => {
        const s = isDev && Date.now()
        const { app, router, store } = createApp()
        router.push(context.url)
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents.length) {
                return Promise.reject({ code: '404' })
            }
            return Promise.all(matchedComponents.map(component => {
                return component.asyncData && component.asyncData({
                    store,
                    route: router.currentRoute
                })
            })).then(() => {
                isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
                context.state = store.state
                resolve(app)
            }).catch(reject)
        }, reject)
    })
}
