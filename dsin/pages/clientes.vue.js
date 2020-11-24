var Clientes = Vue.component('clientes', {
    template: `
        <div class="row">
            <div class="col-12 text-center">
                <h3>Clientes</h3>
            </div>
            <div class="col-12 overflow-auto">
                <b-table id="tb-clientes" small striped hover :items="clientes" :fields="campos" :per-page="perPage" :current-page="currentPage">
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="tb-clientes" align="center"></b-pagination>
            </div>
        </div>
        `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'id', label: 'ID',},
                {key: 'nome', label: 'Nome',},
                {key: 'cpf', label: 'CPF',formatter:this.formatacpf},
                {key: 'email', label: 'E-mail',},
            ],
            clientes: [],
            totalRows: 1,
            id: '',
            nome: '',
            email: ''
        }
    },
    mounted(){
        this.buscaClientes();
    },
    methods:{
        formatacpf(cpf){
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        },
        buscaClientes(){
            this.clientes = [];
            axios.get('http://localhost/dsin/php/api/clientes/buscaclientes.php')
            .then(response => {
                if(response.data.retorno == "OK")
                    this.clientes = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        deletarCliente(data){
            Swal.fire({
                title: 'Excluir Cliente?',
                text: "Deseja excluir o cliente "+data.nome+"?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    axios.delete('http://localhost/dsin/php/api/clientes/deletarcliente.php', {params:{id:data.id}})
                    .then(response => {
                        if(response.data.retorno == "OK"){
                            toastr.success("Cliente excluído com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                            this.buscaClientes();
                        }
                        else{
                            toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                        }
                    })
                    .catch(error => {
                        toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
                    });
                }
              })
        },
        limpaCampos(){
            this.id = ''
            this.nome = ''
            this.email = ''
        },
        cancelar(){
            this.$bvModal.hide('modalCliente');
        }
    },
    watch:{
        clientes(){
            this.totalRows = this.clientes.length == 0 ? 1 : this.clientes.length;
        }
    }
});