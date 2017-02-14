import api from 'create-api'
import Axios from 'axios'

if (api.onServer && !api.warmCacheStarted) {
	api.warmCacheStarted = true
	warmCache()
}

function warmCache () {
	fetchItems((api.cachedIds.top || []).slice(0, 30))
	setTimeout(warmCache, 1000 * 60 * 15)
}


function fetch (child) {
	const cache = api.cachedItems
	if (cache && cache.has(child)) {
		return Promise.resolve(cache.get(child))
	} else {
		return new Promise((resolve, reject) => {
			Axios.get('/api/item/' + child + '/').then(res => {
				const val = res.data
				if (val) val.__lastUpdate = Date.now()
				cache && cache.set(child, val)
				resolve(val)
			}).catch(reject)
		})
	}
}

export function fetchIdsByType (type) {

}