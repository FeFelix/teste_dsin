<?php
    class Clientes{
        private $conn;

        public $id;
        public $nome;
        public $email;
        public $cpf;
        public $senha;
        public $gerencial;
        public $data;
        public $ativo;

        public function __construct($db){
            $this->conn = $db;
        }

        public function buscaClientes(){
            $resultado = new stdClass();

            $sql = "SELECT * FROM usuarios WHERE gerencial = 0 ORDER BY nome";
            $sth = $this->conn->prepare($sql);

            try {
                $sth->execute();
                $resultado->sth = $sth;
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";            
            return $resultado;
        }

        public function incluirCliente(){
            $resultado = new stdClass();

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

            if ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
                if($dados->email != null){
                    $resultado->retorno = "ERRO";
                    $resultado->msg = "E-mail já cadastrado";
                    return $resultado;
                }

                if($dados->cpf != null){
                    $resultado->retorno = "ERRO";
                    $resultado->msg = "Cpf ja cadastrado";
                    return $resultado;
                }
            }

            $sql = "INSERT INTO usuarios(nome, email, cpf, senha, gerencial, data) 
            VALUES(:nome, :email, :cpf, :senha, 0, CURDATE())";
        
            $sth = $this->conn->prepare($sql);
        
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->cpf = htmlspecialchars(strip_tags($this->cpf));
            $this->senha = htmlspecialchars(strip_tags($this->senha));

            $this->senha = md5('sys'.$this->senha.'tem');
        
            try{
                $sth->bindParam(":nome", $this->nome);
                $sth->bindParam(":email", $this->email);
                $sth->bindParam(":cpf", $this->cpf);
                $sth->bindParam(":senha", $this->senha);
                $sth->bindParam(":email", $this->email);
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

        public function alterarCliente(){
            $resultado = new stdClass();

            $sql = "UPDATE usuarios SET nome = :nome, email = :email WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->id = htmlspecialchars(strip_tags($this->id));
        
            try{
                $sth->bindParam(":nome", $this->nome);
                $sth->bindParam(":email", $this->email);
                $sth->bindParam(":id", $this->id);
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
            }
            else{
                $resultado->retorno = "ERRO";   
                $resultado->msg = "Não foi possível alterar o cliente";
            }
         
            return $resultado;
        }

        function deletarCliente(){
            $resultado = new stdClass();

            $sql = "DELETE FROM clientes WHERE id = :id";
            $sth = $this->conn->prepare($sql);
        
            $this->id = htmlspecialchars(strip_tags($this->id));    
            try {
                $sth->bindParam(":id", $this->id);    
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getCode() == 2300;
                return $resultado;
            }
            if($sth->rowCount() > 0)
            {
                $resultado->retorno = "OK";   
            }
            else{
                $resultado->retorno = "ERRO";   
                $resultado->msg = "Cliente não encontrado";
            }
         
            return $resultado;
        }

    }
?>