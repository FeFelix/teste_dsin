var Servicos = Vue.component('servicos', {
    template: `
        <div class="row">
            <b-modal id="modalServicos" ref="refModalServicos" :title="tituloModal">
                <div class="row">
                    <div class="col-12">
                        <label>Descrição</label>
                        <b-input-group label="Descricão" label-for="txtDescricao" onkeypress="return removeCaracteresEspeciaisComEspaco(event,this);">
                            <template #prepend>
                                <b-input-group-text >{{id}}</b-input-group-text>
                            </template>
                            <b-form-input id="txtDescricao" v-model="descricao"  maxlength=40>
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">Valor</label>
                        <b-input-group label-for="txtValor">
                            <b-form-input ref="txtValor" v-currency="{currency: 'BRL', locale: 'pt-BR'}" id="txtValor" v-model="valor">
                            </b-form-input>
                        </b-input-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="salvarServico()">
                        OK
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <div class="col-12 text-center">
                <h3>Serviços</h3>
            </div>
            <div class="col-12 overflow-auto">
                <b-table id="tb-servicos" small striped hover :items="servicos" :fields="campos" :per-page="perPage" :current-page="currentPage">
                    <template #head(btn_add)>
                        <i class="far fa-plus-square text-success is-click" @click="incluirServiço()"></i>
                    </template>
                    <template #head(btn_alterar)>
                        <i class="far fa-edit"></i>
                    </template>
                    <template #cell(btn_alterar)="data">
                        <i class="far fa-edit text-info is-click" @click="alterarServico(data.item)"></i>
                    </template>
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="tb-servicos" align="center"></b-pagination>
            </div>
        </div>
        `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'btn_add', class: 'text-left'},
                {key: 'btn_alterar', class: 'text-left'},
                {key: 'id', label: 'ID',},
                {key: 'descricao', label: 'Descrição',},
                {key: 'valor', label: 'Valor', formatter:this.formataVr},
            ],
            servicos: [],
            totalRows: 1,
            tituloModal: '',
            id: '',
            descricao: '',
            valor: ''
        }
    },
    mounted(){
        this.buscaServicos();
    },
    methods:{
        formataVr(vr){
            return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vr);
        },
        buscaServicos(){
            this.servicos = [];
            axios.get('http://localhost/dsin/php/api/servicos/buscaservicos.php')
            .then(response => {
                if(response.data.retorno == "OK")
                    this.servicos = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        limpaCampos(){
            this.id = '';
            this.descricao = '';
            this.valor = '';
        },
        incluirServiço(){
            this.limpaCampos();
            this.tituloModal = "Incluir Serviço";
            this.$bvModal.show('modalServicos');
        },
        alterarServico(data){
            this.tituloModal = "Alterar Serviço";
            this.id = data.id;
            this.descricao = data.descricao;
            this.valor = data.valor;
            this.$bvModal.show('modalServicos');
        },
        salvarServico(){
            if(!this.descricao || this.descricao.trim() == '' || this.descricao.length < 4 || this.descricao.length > 30){
                toastr.warning("Informe uma descrição (4 a 30 caracteres)","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            var vr = this.$ci.getValue(this.$refs.txtValor);
            if(Number(vr) <= 0){
                toastr.warning("Informe um valor válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            Swal.fire({
                title: Number(this.id) > 0 ? "Alterar" : "Incluir",
                text: Number(this.id) > 0 ? "Deseja alterar o serviço" : "Deseja incluir novo serviço",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if(Number(this.id)> 0)
                        this.confirmaAlterarServico(vr);
                    else
                        this.confirmaIncluirServico(vr);

                }
            })
        },
        confirmaAlterarServico(vr){
            axios.put('http://localhost/dsin/php/api/servicos/alterarservico.php', {id:this.id, descricao:this.descricao, valor:vr})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Serviço alterado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalServicos');
                    this.buscaServicos();
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        confirmaIncluirServico(vr){
            axios.post('http://localhost/dsin/php/api/servicos/incluirservico.php', {descricao:this.descricao, valor:vr})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Serviço incluído com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalServicos');
                    this.buscaServicos();
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        cancelar(){
            this.$bvModal.hide('modalServicos');
        }
    },
    watch:{
        clientes(){
            this.totalRows = this.servicos.length == 0 ? 1 : this.servicos.length;
        }
    }
});