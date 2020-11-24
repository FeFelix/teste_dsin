<?php
    class Usuarios{
        private $conn;

        public $login;
        public $senha;
        public $cpf;
        public $email;
        public $nome;
        public $gerencial;

        public function __construct($db){
            $this->conn = $db;
        }

        public function logar(){
            $resultado = new stdClass();

            $sql = "SELECT id, nome, email, cpf, gerencial, data, ativo FROM usuarios WHERE (cpf= :login OR email = :login) AND senha = :senha AND ativo = 1";
        
            $sth = $this->conn->prepare($sql);
        
            $this->login = htmlspecialchars(strip_tags($this->login));
            $this->senha = htmlspecialchars(strip_tags($this->senha));

            $this->senha = md5('sys'.$this->senha.'tem');
        
            try{
                $sth->bindParam(":login", $this->login);
                $sth->bindParam(":senha", $this->senha);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }
            
            if($sth->rowCount() > 0)
            {
                $resultado->retorno = "OK";   
                $resultado->usuario = $sth->fetch(PDO::FETCH_OBJ);   
            }
            else{
                $resultado->retorno = "ERRO";   
                $resultado->msg = "Login ou senha inválidos";
            }
         
            return $resultado;
        }   

        public function registrarUsuario(){
            $resultado = new stdClass();

            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->cpf = preg_replace('/[^0-9]/', '',htmlspecialchars(strip_tags($this->cpf)));
            $this->senha = htmlspecialchars(strip_tags($this->senha));
            $this->gerencial = htmlspecialchars(strip_tags($this->gerencial));

            $sql = "SELECT email, cpf from usuarios WHERE email = :email OR CPF = :cpf";
        
            $sth = $this->conn->prepare($sql);
        
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->cpf = htmlspecialchars(strip_tags($this->cpf));        
            try{
                $sth->bindParam(":email", $this->email);
                $sth->bindParam(":cpf", $this->cpf);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if ($dados = $sth->fetch(PDO::FETCH_OBJ)){
                if($dados->email == $this->email){
                    $resultado->retorno = "ERRO";
                    $resultado->msg = "E-mail já cadastrado";
                    return $resultado;
                }

                if($dados->cpf = $this->cpf){
                    $resultado->retorno = "ERRO";
                    $resultado->msg = "Cpf ja cadastrado";
                    return $resultado;
                }
            }

            $sql = "INSERT INTO usuarios(nome, email, cpf, senha, data, gerencial) 
            VALUES(:nome, :email, :cpf, :senha, CURDATE(), :gerencial)";
        
            $sth = $this->conn->prepare($sql);
        
            $this->senha = md5('sys'.$this->senha.'tem');
        
            try{
                $sth->bindParam(":nome", $this->nome);
                $sth->bindParam(":email", $this->email);
                $sth->bindParam(":cpf", $this->cpf);
                $sth->bindParam(":senha", $this->senha);
                $sth->bindParam(":gerencial", $this->gerencial);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";  
            return $resultado;
        }
    }
?>