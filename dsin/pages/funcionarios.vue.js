var Funcionarios = Vue.component('funcionarios', {
    template: `
        <div>
        <b-modal id="modalRegistrar" ref="refmodalRegistrar" title="Cadastrar">
                <div class="row">
                    <div class="col-12">
                        <label>Nome</label>
                        <b-input-group label="Nome" label-for="txtNomeRegistro" onkeypress="return removeCaracteresEspeciaisComEspaco(event,this);">
                            <b-form-input id="txtNomeRegistro" v-model="nomeRegistro"  maxlength=20>
                            </b-form-input>
                        </b-input-group> 

                        <label class="mt-3">E-mail</label>
                        <b-input-group label="E-mail" label-for="txtEmailRegistro">
                            <b-form-input id="txtEmailRegistro" v-model="emailRegistro"  maxlength=40>
                            </b-form-input>
                        </b-input-group>

                        <label class="mt-3">cpf</label>
                        <b-input-group label="CPF" label-for="txtCpfRegistro">
                            <b-form-input id="txtCpfRegistro" v-mask="'###.###.###-##'" v-model="cpfRegistro">
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">Senha</label>
                        <b-input-group label="Senha" label-for="txtSenha">
                            <b-form-input type="password" id="txtSenha" v-model="senhaRegistro"  maxlength=20 onkeypress="return removeCaracteresEspeciais(event,this);">
                            </b-form-input>
                        </b-input-group>
                        
                        <label class="mt-3">Confirmar Senha</label>
                        <b-input-group  label="Confirmar Senha" label-for="txtConfirmarSenhaRegistro">
                            <b-form-input type="password" id="txtConfirmarSenhaRegistro" v-model="confirmarSenhaRegistro"  maxlength=20 onkeypress="return removeCaracteresEspeciais(event,this);">
                            </b-form-input>
                        </b-input-group>
                    </div>
                </div>
                <template #modal-footer="{ ok, cancel}">
                    <b-button size="sm" variant="success" @click="clickRegistrar()">
                        Registrar
                    </b-button>
                    
                    <b-button size="sm" variant="danger" @click="clickCancelarRegistrar()">
                        Cancelar
                    </b-button>
                </template>
            </b-modal>
            <div class="row">
                <div class="col-12 text-center">
                    <h3>Funcionários</h3>
                </div>
                <div class="col-12 overflow-auto">
                    <b-table id="tb-funcionarios" small striped hover :items="funcionarios" :fields="campos" :per-page="perPage" :current-page="currentPage">
                    <template #head(btn_add)>
                        <i class="far fa-plus-square text-success is-click" @click="criarConta()"></i>
                    </template>
                    </b-table>
                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="tb-clientes" align="center"></b-pagination>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            perPage: Math.ceil(window.screen.height / 75),
            currentPage: 1,
            campos:[
                {key: 'btn_add', class: 'text-left'},
                {key: 'id', label: 'ID',},
                {key: 'nome', label: 'Nome',},
                {key: 'cpf', label: 'CPF',formatter:this.formatacpf},
                {key: 'email', label: 'E-mail',},
            ],
            funcionarios: [],
            totalRows: 1,
            nomeRegistro:'',
            cpfRegistro:'',
            emailRegistro: '',
            senhaRegistro:'',
            confirmarSenhaRegistro: '',
        }
    },
    mounted(){
        this.buscaFuncionarios();
    },
    methods:{
        formatacpf(cpf){
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        },
        buscaFuncionarios(){
            this.funcionarios = [];
            axios.get('http://localhost/dsin/php/api/funcionarios/buscafuncionarios.php')
            .then(response => {
                if(response.data.retorno == "OK")
                    this.funcionarios = response.data.dados;
                else
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            })
        },
        validarEmail(email) 
        {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
                return true;

            return false;
        },
        validarCPF(cpf) {
            if (!/[0-9]{11}/.test(cpf)) return false;
            if (cpf === "00000000000") return false;
        
            var soma = 0;
        
            for (var i = 1; i <= 9; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }
        
            var resto = soma % 11;
        
            if (resto === 10 || resto === 11 || resto < 2) {
                resto = 0;
            } else {
                resto = 11 - resto;
            }
        
            if (resto !== parseInt(cpf.substring(9, 10))) {
                return false;
            }
        
            soma = 0;
        
            for (var i = 1; i <= 10; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }
            resto = soma % 11;
        
            if (resto === 10 || resto === 11 || resto < 2) {
                resto = 0;
            } else {
                resto = 11 - resto;
            }
        
            if (resto !== parseInt(cpf.substring(10, 11))) {
                return false;
            }
        
            return true;
        },
        criarConta(){
            this.$bvModal.show('modalRegistrar');
        },
        limparCamposRegistro(){
            this.nomeRegistro = '';
            this.cpfRegistro = '';
            this.emailRegistro = '';
            this.senhaRegistro = '';
            this.confirmarSenhaRegistro = '';
        },
        clickRegistrar(){
            let cpf = "";
            if(!this.nomeRegistro || this.nomeRegistro.trim() == ''){
                toastr.warning("Informe um nome","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(!this.emailRegistro || !this.validarEmail(this.emailRegistro)){
                toastr.warning("Informe um e-mail válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            cpf = this.cpfRegistro.replace(/[^\d]+/g,'');
            if(!this.validarCPF(cpf))
            {
                toastr.warning("Informe um cpf válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(!this.senhaRegistro || this.senhaRegistro.trim() == '' || this.senhaRegistro.length < 6 || this.senhaRegistro.length > 20){
                toastr.warning("Informe uma senha (entre 6 a 20 caracteres)","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            if(!this.confirmarSenhaRegistro || this.confirmarSenhaRegistro.trim() == '' || this.confirmarSenhaRegistro.length < 6 || this.confirmarSenhaRegistro.length > 20){
                toastr.warning("Informe uma senha (entre 6 a 20 caracteres)","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }


            if(this.senhaRegistro != this.confirmarSenhaRegistro){
                toastr.warning("Senha e confirmação da senha não conferem","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            const objAux = {
                nome : this.nomeRegistro,
                cpf : cpf,
                email : this.emailRegistro,
                senha : this.senhaRegistro,
                gerencial: 1
            }

            axios.post('http://localhost/dsin/php/api/usuarios/registrarusuario.php', objAux)
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("Funcionário registrado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.limparCamposRegistro();
                    this.buscaFuncionarios();
                    this.$bvModal.hide('modalRegistrar');
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });
        },
        clickCancelarRegistrar(){
            this.limparCamposRegistro();
            this.$bvModal.hide('modalRegistrar');
        },
        cancelar(){
            this.$bvModal.hide('modalRegistrar');
        }
    },
    watch:{
        funcionarios(){
            this.totalRows = this.funcionarios.length == 0 ? 1 : this.funcionarios.length;
        }
    }
});