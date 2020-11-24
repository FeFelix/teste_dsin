var Agendamentos = Vue.component('agendamentos', {
    template: `
        <div>
            <b-modal id="modalAgendar" ref="refModalAgendar" :title="tituloModal">
                <div class="row">
                    <div class="col-12">
                        <label>Serviço</label>
                        <b-input-group label="Nome" label-for="cmbServicos">
                            <b-form-select id="cmbServicos" v-model="servico" :options="listaServicos"></b-form-select>
                            </b-form-input>
                        </b-input-group>
                        
                        <div class="col-12">
                        <b-form-group label="Data do agendamento">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="data" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="incluirAgendamento()">
                        Agendar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <b-modal id="ModalPesquisaAgendamentos" ref="refModalPesquisaAgendamentos" title="Pesquisar Agendamentos">
                <div class="row">
                    <div class="col-12">
                        <label>Serviços</label>
                        <b-input-group label="NomePesquisa" label-for="cmbServicosPesquisa">
                            <b-form-select id="cmbServicosPesquisa" v-model="servicoPesquisa" :options="listaServicos"></b-form-select>
                            </b-form-input>
                        </b-input-group>

                        <b-form-group label="Situação">
                            <b-form-radio-group id="radioGroupSituacao" v-model="situacaoPesquisa" name="radioGroupSituacao">
                                <b-form-radio value="">Todas</b-form-radio>
                                <b-form-radio value="0">Arguardando</b-form-radio>
                                <b-form-radio value="1">Aceito</b-form-radio>
                                <b-form-radio value="2">Finalizadas</b-form-radio>
                                <b-form-radio value="3">Canceladas</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="De">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataPesquisaInicio" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Até">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataPesquisaFim" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="pesquisarAgendamentos()">
                        Pesquisar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <div class="row">
                <div class="col-3 text-left">
                    <b-button size="sm" variant="success" @click="clickIncluirAgendamento()">
                        Agendar
                    </b-button>
                </div>
                <div class="col-6 text-center">
                    <h3> Agendamentos</h3>
                </div>
                <div class="col-3 text-right">
                    <b-button size="sm" variant="info" @click="clickPerquisarAgendamentos()">
                        Pesquisar
                    </b-button>
                </div>
            </div>
            <div class="col-12 overflow-auto">
                <b-table id="tb-agendamentos" small striped hover :items="agendamentos" :fields="campos" :per-page="perPage" :current-page="currentPage">
                    <template #head(btn_cancelar)>
                        <i class="fas fa-ban"></i>
                    </template>
                    <template #cell(btn_cancelar)="data">
                        <i  class="fas fa-ban text-danger is-click" @click="cancelarAgendamento(data.item)"></i>
                    </template>
                    <template #table-caption>
                        <div class="row">
                            <div class="col-12">
                                <i class="fas fa-square text-success mr-2"> Confirmado</i>   
                                <i class="fas fa-square text-info mr-2"> Finalizado</i>   
                                <i class="fas fa-square text-warning"> Cancelado</i>                            
                            </div>
                        </div>
                    </template>
                </b-table>
                <b-pagination v-model="currentPage" :total-rows="totalRows" align="center" :per-page="perPage" aria-controls="tb-agendamentos"></b-pagination>
            </div>
        </div>
    `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'btn_cancelar', class: 'text-left'},
                {key: 'descricao', label: 'Serviço',},
                {key: 'valor', label: 'Valor', formatter:this.formataVr},
                {key: 'data', label: 'Data', formatter:this.formataDataBr},
                {key: 'situacao_desc', label: 'Situação'},
            ],
            rdSituacao: '',
            agendamentos: [],
            totalRows: 1,
            tituloModal: '',
            listaServicos: [],
            servico: "",
            valor: '',
            servicoPesquisa: '',
            situacaoPesquisa: '',
            dataPesquisaInicio: '',
            dataPesquisaFim: '',

            id: '',
            descricao: '',
            data: ''
        }
    },
    async mounted(){
        await this.buscaAgendamentos();
        await this.buscaServicos();
    },
    methods:{
        formataDataBr(dt){
            if(dt != null && dt != '')
            {
                return dt.split('-').reverse().join("/");
            }

            return '';
        },
        formataVr(vr){
            return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vr);
        },
        pesquisarAgendamentos(){
            var obj = {};
            if(this.servicoPesquisa && Number(this.servicoPesquisa) > 0)
                obj.servico = this.servicoPesquisa;

            obj.situacao = this.situacaoPesquisa;

            if(this.dataPesquisaInicio || this.dataPesquisaFim){
                if(!this.dataPesquisaInicio || !this.dataPesquisaFim){
                    toastr.warning("Informe datas de início e fim","", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
                else{
                    obj.datainicio = this.dataPesquisaInicio;
                    obj.datafim = this.dataPesquisaFim;
                }
            }
            this.$bvModal.hide('ModalPesquisaAgendamentos');
            this.buscaAgendamentos(obj);
        },
        async buscaAgendamentos(pesquisa = {}){
            pesquisa.id_usuario = this.$store.getters.usuario.id
            this.agendamentos = [];
            await axios.get('http://localhost/dsin/php/api/agendamentos/buscaagendamentos.php', {params:pesquisa})
            .then(response => {
                if(response.data.retorno == "OK")
                    this.agendamentos = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        async buscaServicos(){
            this.listaServicos = [];
            await axios.get('http://localhost/dsin/php/api/servicos/buscaservicos.php')
            .then(response => {
                const formataVrAux = this.formataVr;
                if(response.data.retorno == "OK"){
                    this.listaServicos = response.data.dados.map(function(ag) {
                        return {
                            value : ag.id,
                            text : ag.descricao +' -- '+ formataVrAux(ag.valor),
                        };
                    });
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        clickPerquisarAgendamentos(){
            this.$bvModal.show('ModalPesquisaAgendamentos');
        },
        cancelarAgendamento(data){
            if(Number(data.situacao) == 3){
                toastr.warning("Agendamento já foi cancelado","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(Number(data.situacao) == 2){
                toastr.warning("Agendamento foi finalizado","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            Swal.fire({
                title: 'Cancelar agendamento?',
                text: "Deseja cancelar o agendamento?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
              })
              .then((result) => {
                if (result.isConfirmed) {
                    axios.put('http://localhost/dsin/php/api/agendamentos/cancelaragendamento.php', {id:data.id})
                    .then(response => {
                        if(response.data.retorno == "OK"){
                            toastr.success("Agendamento cancelado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                            this.buscaAgendamentos();
                        }
                        else if(response.data.retorno == "TEMPO"){
                            toastr.info(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
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
            this.id = "";
            this.descricao = "";
            this.valor = '';
            this.data = '';
        },
        clickIncluirAgendamento(){
            this.limpaCampos();
            this.tituloModal = "Incluir Agendamento";
            this.$bvModal.show('modalAgendar');
        },
        incluirAgendamento(){
            if(!this.servico || Number(this.servico) == 0){
                toastr.warning("Selecione um serviço","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(!this.data){
                toastr.warning("Informe a data do agendamento","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            else{
                var dt = new Date();
                dt.setDate(dt.getDate() + 2);

                var dd = dt.getDate();
                var mm = dt.getMonth() + 1; 
                var yyyy = dt.getFullYear();

                if(dd < 10) 
                    dd = '0'+dd;

                if(mm < 10) 
                    mm = '0'+mm;

                dataDisponivel = yyyy+'-'+mm+'-'+dd;
                dataDisponivelBR = dd+'/'+mm+'/'+yyyy;
                if((new Date(this.data)) <= (new Date(dataDisponivel))){
                    toastr.warning("Informe uma data após "+dataDisponivelBR,"", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
            }
            
            Swal.fire({
                title: "Incluir",
                text: "Deseja incluir novo agendamento?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.confirmaIncluirAgendamento();
                }
            })
        },
        confirmaIncluirAgendamento(){
            axios.post('http://localhost/dsin/php/api/agendamentos/incluiragendamento.php', {servico:this.servico, data: this.data, id_usuario: this.$store.getters.usuario.id})
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Agendamento incluído com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.$bvModal.hide('modalAgendar');
                    this.buscaAgendamentos();
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
            this.$bvModal.hide('modalAgendar');
        },
        watch:{
            agendamentos(){
                this.agendamentos = this.agendamentos.length == 0 ? 1 : this.agendamentos.length;
            }
        }
    }
});