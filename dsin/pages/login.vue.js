
var Login = Vue.component('login', {
    template: `
        <div class="row">
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
            <div class="col-12 text-center">
                <h3>Login</h3>
            </div>
            <div class="col-6 offset-3">
                <label>cpf / e-mail</label>
                <b-input-group label="Login" label-for="txtLogin">
                    <b-form-input id="txtLogin" v-model="login"  maxlength=40>
                    </b-form-input>
                </b-input-group>
                
                <label class="mt-3">Senha</label>
                <b-input-group label="Senha" label-for="txtSenha">
                    <b-form-input type="password" id="txtSenha" v-model="senha"  maxlength=20>
                    </b-form-input>
                </b-input-group>
            </div>
            <div class="col-3">
            </div>
            <div class="col-12 mt-5 text-center">
                <b-button size="sm" variant="success" @click="logar()">Entar</b-button>
                <b-button size="sm" variant="info" @click="criarConta()">Criar conta</b-button>
            </div>
        </div>
        `,
    data(){
        return {
            login: '',
            senha: '',
            nomeRegistro:'',
            cpfRegistro:'',
            emailRegistro: '',
            senhaRegistro:'',
            confirmarSenhaRegistro: '',
        }
    },
    mounted(){
    },
    methods:{
        limpaCampos(){
            this.login = '';
            this.senha = '';
        },
        logar(){
            let cpf = "";
            if(!this.login || this.login.trim() == ''){
                toastr.warning("Informe um login","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }

            if(this.login.includes("@")){
                if(!this.validarEmail(this.login)){
                    toastr.warning("Informe um e-mail válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
            }
            else{               
                cpf = this.login.replace(/[^\d]+/g,'');
                if(!this.validarCPF(cpf))
                {
                    toastr.warning("Informe um cpf válido","", {timeOut: 2000, positionClass: "toast-top-center"});
                    return;
                }
            }

            if(!this.senha || this.senha.trim() == ''){
                toastr.warning("Informe uma senha","", {timeOut: 2000, positionClass: "toast-top-center"});
                return;
            }
            
            axios.post('http://localhost/dsin/php/api/usuarios/logar.php', {login:this.login, senha:this.senha})
            .then(response => {
                if(response.data.retorno == "OK"){
                    this.$store.commit('SET_USUARIO', response.data.usuario);
                    this.$bvModal.hide('modalCliente');
                    this.$router.push({ path: 'principal' });
                }
                else{
                    toastr.warning(response.data.msg,"", {timeOut: 2000, positionClass: "toast-top-center"});
                }
            })
            .catch(error => {
                toastr.warning(error,"", {timeOut: 2000, positionClass: "toast-top-center"});
            });

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
                gerencial: 0
            }

            axios.post('http://localhost/dsin/php/api/usuarios/registrarusuario.php', objAux)
            .then(response => {
                if(response.data.retorno == "OK"){
                    toastr.success("usuário registrado com sucesso","", {timeOut: 2000, positionClass: "toast-top-center"});
                    this.limparCamposRegistro();
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
    }
});