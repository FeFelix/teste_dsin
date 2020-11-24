var Principal = Vue.component('principal', {
    template: `
        <div>
            <nav class="navbar navbar-expand navbar-dark bg-dark">
                <span class="navbar-brand">Bem vindo(a) {{ $store.getters.usuario.nome }} <b v-if="Number($store.getters.usuario.gerencial) == '1'">Admin</b></span>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto">
                        <li v-if="Number($store.getters.usuario.gerencial) == 1" class="nav-item">
                            <router-link to="/principal/clientes"><a class="nav-link">Clientes</a></router-link>
                        </li>
                        <li v-if="Number($store.getters.usuario.gerencial) == 1" class="nav-item">
                            <router-link to="/principal/funcionarios"><a class="nav-link">Funcionários</a></router-link>
                        </li>
                        <li v-if="Number($store.getters.usuario.gerencial) == 1" class="nav-item">
                            <router-link to="/principal/servicos"><a class="nav-link">Serviços</a></router-link>
                        </li>
                        <b-nav-item-dropdown text="Agendamentos" right>
                            <b-dropdown-item href="#" v-if="Number($store.getters.usuario.gerencial) == 0"><router-link to="/principal/agendamentos">Agendar</router-link></b-dropdown-item>
                            <b-dropdown-item href="#" v-if="Number($store.getters.usuario.gerencial) == 1"><router-link to="/principal/agendamentos_admin">Agendar</router-link></b-dropdown-item>
                        </b-nav-item-dropdown >
                        <b-nav-item-dropdown v-if="Number($store.getters.usuario.gerencial) == 1" text="Relatórios" right>
                            <b-dropdown-item href="#"><router-link to="/principal/rel_agendamentos">Agendamentos</router-link></b-dropdown-item>
                        </b-nav-item-dropdown >
                    </ul>
                </div>
            </nav> 
            <div class="row">
                <div class="col-12">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
        }
    }
});