

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		usuario: null
	},
	mutations: {
		SET_USUARIO(state, usuario) {
			state.usuario = usuario;
		}
	},
	getters: {
		usuario: state => state.usuario
	}
});

Vue.use(VueRouter);

const routes = [	
	{
		path: '/',
		name: "login",
		component: Login
	},
	{
		path: '/principal',
		name: "principal",
		component: Principal,
		children:[
			{
				path: 'clientes',
				name: "clientes",
				component: Clientes
			},
			{
				path: 'agendamentos',
				name: "agendamentos",
				component: Agendamentos
			},
			{
				path: 'servicos',
				name: "servicos",
				component: Servicos
			},
			{
				path: 'agendamentos_admin',
				name: "agendamentos_admin",
				component: AgendamentosAdmin
			},
			{
				path: 'rel_agendamentos',
				name: "rel_agendamentos",
				component: RelAgendamentos
			},
			{
				path: 'funcionarios',
				name: "funcionarios",
				component: Funcionarios
			}
		]
	}	
]

let router = new VueRouter({
	routes
});

router.beforeEach((to, from, next) => {
	if (to.name !== 'login' && store.getters.usuario == null) {
		next({ path: '/' });
	  } 
	  else {
		next();
	  }
});

Vue.use(VueTheMask);

var app = new Vue({
	el: '#app',
	router,
	store
});

function removeCaracteresEspeciaisComEspaco(e){
    var regex = new RegExp("^[a-zA-Z0-9._ \b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
};

function removeCaracteresEspeciais(e){
    var regex = new RegExp("^[a-zA-Z0-9._@#$&\b]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
};