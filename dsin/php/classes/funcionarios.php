<?php
    class Funcionarios{
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

        public function buscaFuncionarios(){
            $resultado = new stdClass();

            $sql = "SELECT * FROM usuarios WHERE gerencial = 1 ORDER BY nome";
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

    }
?>