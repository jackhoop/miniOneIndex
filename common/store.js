import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		item:{},
		progress:0,
		pageSize:5,
		env:"", //环境ID
		token:{
			access_token:"",
			expires_in:0,
		}

    },
	
    mutations: {
        setToken(state, token) {
            state.token.access_token = token.access_token;
        },
		setProgress(state, progress) {
		    state.progress = progress;
		},
		setItem(state, item) {
		    state.item = item;
		},
    }
})
export default store