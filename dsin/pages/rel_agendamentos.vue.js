var RelAgendamentos = Vue.component('rel_agendamentos', {
    template: `
        <div class="row">
            <b-modal id="modalRelatorio" ref="refModalRelatorio" title="Relatório">
                <div class="row">
                    <div class="col-12">
                        <label>Serviços</label>
                        <b-input-group  label-for="cmbServicos">
                            <b-form-select id="cmbServicos" v-model="servico" :options="listaServicos"></b-form-select>
                            </b-form-input>
                        </b-input-group>

                        <label>Clientes</label>
                        <b-input-group  label-for="cmbClientes">
                            <b-form-select id="cmbClientes" v-model="cliente" :options="listaClientes"></b-form-select>
                            </b-form-input>
                        </b-input-group>

                        <b-form-group label="Situação">
                            <b-form-radio-group id="radioGroupSituacao" v-model="situacao" name="radioGroupSituacao">
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
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataInicio" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                    <div class="col-6">
                        <b-form-group label="Até">
                            <b-form-datepicker placeholder="Data" today-button label-today-button="Hoje" reset-button label-reset-button="Limpar" close-button label-close-button="Fechar" v-model="dataFim" locale="pt-BR"></b-form-datepicker>
                        </b-form-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="clickGerarRelatorio()">
                        Gerar
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
        </div>
        `,
    data(){
        return {
            listaServicos: [],
            listaClientes:[],
            servico: '',
            cliente: '',
            situacao: '',
            dataInicio: '',
            dataFim:''
        }
    },
    async mounted(){
        await this.buscaServicos();
        await this.buscaClientes();
        this.$bvModal.show('modalRelatorio');
    },
    methods:{
        async buscaServicos(){
            this.listaServicos = [];
            await axios.get('http://localhost/dsin/php/api/servicos/buscaservicos.php')
            .then(response => {
                if(response.data.retorno == "OK"){
                    this.listaServicos = response.data.dados.map(function(ag) {
                        return {
                            value : ag.id,
                            text : ag.descricao,
                        };
                    });
                    this.listaServicos.push({value: '', text:"Todos"});
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        async buscaClientes(){
            this.listaClientes = [];
            await axios.get('http://localhost/dsin/php/api/clientes/buscaclientes.php')
            .then(response => {
                if(response.data.retorno == "OK"){
                    this.listaClientes = response.data.dados.map(function(ag) {
                        return {
                            value : ag.id,
                            text : ag.nome,
                        };
                    });
                    this.listaClientes.push({value: '', text:"Todos"});
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        clickGerarRelatorio(){
            var obj = {};
            if(this.servico && Number(this.servico) > 0)
                obj.id_servico = this.servico;

            if(this.cliente && Number(this.cliente) > 0)
                obj.id_usuario = this.cliente;

            obj.situacao = this.situacao;

            if(this.dataInicio || this.dataFim){
                if(!this.dataInicio || !this.dataFim){
                    toastr.warning("Informe datas de início e fim","", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
                else{
                    obj.datainicio = this.dataInicio;
                    obj.datafim = this.dataFim;
                }
            }

            axios.get('http://localhost/dsin/php/api/relatorios/agendamentos.php', {params:obj})
            .then(response => {
                if(response.data.retorno == "OK"){
                    window.open(response.data.caminho);
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        cancelar(){
            this.$bvModal.hide('modalRelatorio');
            this.$router.push({ path: 'principal' });
        }
    }
});