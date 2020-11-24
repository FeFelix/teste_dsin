<?php
    class Servicos{
        private $conn;

        public $id;
        public $descricao;
        public $valor;

        public function __construct($db){
            $this->conn = $db;
        }

        public function buscaServicos(){
            $resultado = new stdClass();

            $sql = "SELECT * FROM servicos";
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

        public function incluirServico(){
            $resultado = new stdClass();
            
            $this->descricao = htmlspecialchars(strip_tags($this->descricao));  

            $sql = "SELECT descricao from servicos WHERE descricao = :descricao";
        
            $sth = $this->conn->prepare($sql);
            
            try{
                $sth->bindParam(":descricao", $this->descricao);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if($sth->rowCount() > 0){
                $resultado->retorno = "ERRO";
                $resultado->msg = "Descrição ja informada para outro serviço";
                return $resultado;
            }

            $sql = "INSERT INTO servicos(descricao, valor) 
            VALUES(:descricao, :valor)";
        
            $sth = $this->conn->prepare($sql);
        
            $this->valor = htmlspecialchars(strip_tags($this->valor));
        
            try{
                $sth->bindParam(":descricao", $this->descricao);
                $sth->bindParam(":valor", $this->valor);
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

        public function alterarServico(){
            $resultado = new stdClass();            
        
            $this->descricao = htmlspecialchars(strip_tags($this->descricao));
            $this->id = htmlspecialchars(strip_tags($this->id));

            $sql = "SELECT descricao from servicos WHERE descricao = :descricao AND id <> :id";
        
            $sth = $this->conn->prepare($sql);
            
            try{
                $sth->bindParam(":descricao", $this->descricao);
                $sth->bindParam(":id", $this->id);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            if($sth->rowCount() > 0){
                $resultado->retorno = "ERRO";
                $resultado->msg = "Descrição ja informada para outro serviço";
                return $resultado;
            }

            $sql = "UPDATE servicos SET descricao = :descricao, valor = :valor WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
            $this->valor = htmlspecialchars(strip_tags($this->valor));
        
            try{
                $sth->bindParam(":descricao", $this->descricao);
                $sth->bindParam(":valor", $this->valor);
                $sth->bindParam(":id", $this->id);
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